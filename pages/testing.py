def findMinGeneration(layer):
    generation = 0
    n = len(layer)
    
    
    while True:
        maximum = max(layer)
        
        if all(x == maximum for x in layer):
            return generation
        generation = generation + 1
        
        if generation % 2 == 1:
            best = -1
            for i in range(n):
                if maximum - layer[i] >= 2:
                    best = i
                    break
            if best != -1:
                layer[best] += 1
        
        
        else:
            best = -1
            for i in range(n):
                if maximum - layer[i] >= 1:
                    best = i
                    break
            if best != -1:
                layer[best] += 2


