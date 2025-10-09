import random

def generate_random_numbers():
    numbers = random.sample(range(1, 26), 15)
    print("Números aleatórios gerados:", numbers)

if __name__ == "__main__":
    generate_random_numbers()