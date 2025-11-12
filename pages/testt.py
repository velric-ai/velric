def findMinGeneration(layer):
    generation = 0
    layer = layer[1:]
    n = len(layer)
    
    if n == 0:
        return 0
    
    while True:
        maximum = max(layer)
        
        if all(x == maximum for x in layer):
            return generation
            
        generation = generation + 1
        
        if generation % 2 == 1:
            best = -1
            for i in range(n):
                if layer[i] + 1 == maximum or maximum - (layer[i] + 1) >= 2:
                    best = i
                    break
            if best != -1:
                layer[best] += 1
        
        else:
            best = -1
            for i in range(n):
                new_val = layer[i] + 2
                if new_val == maximum or maximum - new_val >= 1:
                    best = i
                    break
            if best != -1:
                layer[best] += 2


if __name__ == "__main__":
    layer = [3, 3, 3, 6]
    print(findMinGeneration(layer))
