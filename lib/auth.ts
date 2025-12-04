import { supabase } from './supabaseClient';

// Check if user exists by email
export async function checkUserExists(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  
  return !!data && !error;
}

// Result type for getUser
export type GetUserResult = 
  | { success: true; data: {
      id: string;
      email: string;
      name: string | null;
      onboarded: boolean;
      isRecruiter: boolean;
      createdAt: string;
      surveyCompletedAt: string | null;
      surveyCompleted: boolean;
      profileComplete: boolean;
    }}
  | { success: false; error: string };

// Get user from database (for login)
export async function getUser(authUser: {
  id?: string;
  email: string;
  accessToken?: string;
  refreshToken?: string | null;
  expiresAt?: number | null;
}): Promise<GetUserResult> {
  // Check if user exists by email (primary check)
  const { data: existingUserByEmail, error: checkEmailError } = await supabase
    .from("users")
    .select("*")
    .eq("email", authUser.email)
    .maybeSingle();

  // Check if user exists by id (if id provided)
  let existingUserById = null;
  if (authUser.id) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();
    existingUserById = data;
  }

  const existingUser = existingUserById || existingUserByEmail;

  if (!existingUser) {
    return { success: false, error: "User not found. Please sign up first." };
  }

  // Update id if it changed (email match but different id) and we have a new id
  if (existingUserByEmail && authUser.id && existingUserByEmail.id !== authUser.id) {
    await supabase
      .from("users")
      .update({ id: authUser.id })
      .eq("email", authUser.email);
    existingUser.id = authUser.id;
  }

  // Store/update Google OAuth tokens if provided
  if (authUser.accessToken) {
    try {
      // expiresAt from NextAuth is already in milliseconds, so use it directly
      const expiresAtISO = authUser.expiresAt ? new Date(authUser.expiresAt).toISOString() : null;
      console.log(`[Auth] Storing Google tokens for user ${existingUser.id}`, {
        hasAccessToken: !!authUser.accessToken,
        hasRefreshToken: !!authUser.refreshToken,
        expiresAt: expiresAtISO,
      });

      // Build update object without updated_at (may not exist in all schemas)
      const updateData: any = {
        google_access_token: authUser.accessToken,
        google_refresh_token: authUser.refreshToken,
        google_token_expires_at: expiresAtISO,
      };
      
      const { error: tokenUpdateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', existingUser.id);

      if (tokenUpdateError) {
        // If columns don't exist, log warning but don't fail
        if (tokenUpdateError.message?.includes('column') || tokenUpdateError.code === '42703') {
          console.error('[Auth] Google OAuth token columns not found. Please run migration:', tokenUpdateError.message);
        } else {
          console.error('[Auth] Could not store tokens:', tokenUpdateError);
        }
      } else {
        console.log(`[Auth] ✅ Successfully stored Google OAuth tokens for user ${existingUser.id}`);
      }
    } catch (tokenError: any) {
      console.error('[Auth] Error storing tokens:', tokenError);
    }
  } else {
    console.warn(`[Auth] No access token provided for user ${existingUser.id}`);
  }

  return {
    success: true,
    data: {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      onboarded: existingUser.onboarded,
      isRecruiter: Boolean(existingUser.is_recruiter),
      createdAt: existingUser.created_at,
      surveyCompletedAt: existingUser.survey_completed_at,
      surveyCompleted: existingUser.survey_completed_at !== null,
      profileComplete: existingUser.profile_complete,
    },
  };
}

// Result type for createUser
export type CreateUserResult = 
  | { success: true; data: {
      id: string;
      email: string;
      name: string | null;
      onboarded: boolean;
      isRecruiter: boolean;
      createdAt: string;
      surveyCompletedAt: string | null;
      surveyCompleted: boolean;
      profileComplete: boolean;
    }}
  | { success: false; error: string };

// Create user in database (for signup)
export async function createUser(authUser: {
  id?: string;
  email: string;
  name?: string | null;
  image?: string | null;
  isRecruiter?: boolean;
  accessToken?: string;
  refreshToken?: string | null;
  expiresAt?: number | null;
}): Promise<CreateUserResult> {
  // Check if user already exists
  const userExists = await checkUserExists(authUser.email);
  if (userExists) {
    return { success: false, error: "User already exists. Please sign in instead." };
  }

  const userId = authUser.id || authUser.email;
  const name = authUser.name || authUser.email?.split("@")[0] || "User";
  const isRecruiter = authUser.isRecruiter ?? false; // Use provided value or default to false

  const { data: newUser, error: createError } = await supabase
    .from("users")
    .insert([
      {
        id: userId,
        email: authUser.email,
        name: name,
        onboarded: false,
        is_recruiter: isRecruiter,
        created_at: new Date().toISOString(),
        survey_completed_at: null,
        profile_complete: false,
        // Store Google OAuth tokens if provided
        google_access_token: authUser.accessToken || null,
        google_refresh_token: authUser.refreshToken || null,
        // expiresAt from NextAuth is already in milliseconds, so use it directly
        google_token_expires_at: authUser.expiresAt ? new Date(authUser.expiresAt).toISOString() : null,
      },
    ])
    .select()
    .single();

  if (createError) {
    // Handle duplicate key error
    if (createError.code === "23505") {
      return { success: false, error: "User already exists. Please sign in instead." };
    }
    // If columns don't exist, try without tokens
    if (createError.message?.includes('column') || createError.code === '42703') {
      console.warn('Google OAuth token columns not found. Creating user without tokens.');
      const { data: userWithoutTokens, error: retryError } = await supabase
        .from("users")
        .insert([
          {
            id: userId,
            email: authUser.email,
            name: name,
            onboarded: false,
            is_recruiter: isRecruiter,
            created_at: new Date().toISOString(),
            survey_completed_at: null,
            profile_complete: false,
          },
        ])
        .select()
        .single();
      
      if (retryError) {
        return { success: false, error: retryError.message || "Failed to create user account." };
      }
      
      return {
        success: true,
        data: {
          id: userWithoutTokens.id,
          email: userWithoutTokens.email,
          name: userWithoutTokens.name,
          onboarded: userWithoutTokens.onboarded,
          isRecruiter: Boolean(userWithoutTokens.is_recruiter),
          createdAt: userWithoutTokens.created_at,
          surveyCompletedAt: userWithoutTokens.survey_completed_at,
          surveyCompleted: userWithoutTokens.survey_completed_at !== null,
          profileComplete: userWithoutTokens.profile_complete,
        },
      };
    }
    return { success: false, error: createError.message || "Failed to create user account." };
  }

  // If tokens weren't stored during insert (columns don't exist), try to update
  if (authUser.accessToken && (!newUser.google_access_token)) {
    try {
      // expiresAt from NextAuth is already in milliseconds, so use it directly
      const expiresAtISO = authUser.expiresAt ? new Date(authUser.expiresAt).toISOString() : null;
      console.log(`[Auth] Storing Google tokens for new user ${newUser.id}`, {
        hasAccessToken: !!authUser.accessToken,
        hasRefreshToken: !!authUser.refreshToken,
        expiresAt: expiresAtISO,
      });

      // Build update object without updated_at (may not exist in all schemas)
      const updateData: any = {
        google_access_token: authUser.accessToken,
        google_refresh_token: authUser.refreshToken,
        google_token_expires_at: expiresAtISO,
      };
      
      const { error: tokenUpdateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', newUser.id);

      if (tokenUpdateError) {
        if (tokenUpdateError.message?.includes('column') || tokenUpdateError.code === '42703') {
          console.error('[Auth] Google OAuth token columns not found. Please run migration:', tokenUpdateError.message);
        } else {
          console.error('[Auth] Could not store tokens:', tokenUpdateError);
        }
      } else {
        console.log(`[Auth] ✅ Successfully stored Google OAuth tokens for new user ${newUser.id}`);
      }
    } catch (tokenError: any) {
      console.error('[Auth] Error storing tokens:', tokenError);
    }
  } else if (authUser.accessToken) {
    console.log(`[Auth] ✅ Google tokens already stored for new user ${newUser.id}`);
  } else {
    console.warn(`[Auth] No access token provided for new user ${newUser.id}`);
  }

  return {
    success: true,
    data: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      onboarded: newUser.onboarded,
      isRecruiter: Boolean(newUser.is_recruiter),
      createdAt: newUser.created_at,
      surveyCompletedAt: newUser.survey_completed_at,
      surveyCompleted: newUser.survey_completed_at !== null,
      profileComplete: newUser.profile_complete,
    },
  };
}

// Helper function to get or create user in database after NextAuth authentication (for backward compatibility)
export async function getOrCreateUser(authUser: {
  id?: string;
  email: string;
  name?: string | null;
  image?: string | null;
}) {
  // Use email as primary identifier if id not provided (NextAuth default)
  const userId = authUser.id || authUser.email;

  // Check if user exists by email (primary check)
  const { data: existingUserByEmail, error: checkEmailError } = await supabase
    .from("users")
    .select("*")
    .eq("email", authUser.email)
    .maybeSingle();

  // Check if user exists by id (if id provided)
  let existingUserById = null;
  if (authUser.id) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();
    existingUserById = data;
  }

  const existingUser = existingUserById || existingUserByEmail;

  // If user exists, return it
  if (existingUser) {
    // Update id if it changed (email match but different id) and we have a new id
    if (existingUserByEmail && authUser.id && existingUserByEmail.id !== authUser.id) {
      await supabase
        .from("users")
        .update({ id: authUser.id })
        .eq("email", authUser.email);
      existingUser.id = authUser.id;
    }

    return {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      onboarded: existingUser.onboarded,
      isRecruiter: Boolean(existingUser.is_recruiter),
      createdAt: existingUser.created_at,
      surveyCompletedAt: existingUser.survey_completed_at,
      surveyCompleted: existingUser.survey_completed_at !== null,
      profileComplete: existingUser.profile_complete,
    };
  }

  // Create new user
  const name = authUser.name || authUser.email?.split("@")[0] || "User";
  const isRecruiter = false; // Default to professional

  const { data: newUser, error: createError } = await supabase
    .from("users")
    .insert([
      {
        id: userId, // Use email as id if no id provided
        email: authUser.email,
        name: name,
        onboarded: false,
        is_recruiter: isRecruiter,
        created_at: new Date().toISOString(),
        survey_completed_at: null,
        profile_complete: false,
      },
    ])
    .select()
    .single();

  if (createError) {
    // Handle duplicate key error
    if (createError.code === "23505") {
      // Try to load the existing user
      const { data: loadedUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", authUser.email)
        .maybeSingle();

      if (loadedUser) {
        return {
          id: loadedUser.id,
          email: loadedUser.email,
          name: loadedUser.name,
          onboarded: loadedUser.onboarded,
          isRecruiter: Boolean(loadedUser.is_recruiter),
          createdAt: loadedUser.created_at,
          surveyCompletedAt: loadedUser.survey_completed_at,
          surveyCompleted: loadedUser.survey_completed_at !== null,
          profileComplete: loadedUser.profile_complete,
        };
      }
    }
    throw createError;
  }

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    onboarded: newUser.onboarded,
    isRecruiter: Boolean(newUser.is_recruiter),
    createdAt: newUser.created_at,
    surveyCompletedAt: newUser.survey_completed_at,
    surveyCompleted: newUser.survey_completed_at !== null,
    profileComplete: newUser.profile_complete,
  };
}

