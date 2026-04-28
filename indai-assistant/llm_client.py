import ollama

def get_response(prompt, system_prompt="You are INDAI, a helpful PC assistant."):
    """
    Gets a response from the local Ollama model.
    """
    try:
        response = ollama.chat(model='llama3', messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': prompt},
        ])
        return response['message']['content']
    except Exception as e:
        return f"Error connecting to Ollama: {str(e)}"

if __name__ == "__main__":
    # Test
    print(get_response("Hello, who are you?"))
