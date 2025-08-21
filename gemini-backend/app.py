import google.generativeai as genai

# 🔐 Step: Set the API key
genai.configure(api_key="AIzaSyDOdPUzG65tstYRWNhBo3cGFWGXqCOu0z0")

# ✅ Step: Create the model
model = genai.GenerativeModel('gemini-pro')

# 💬 Step: Send a prompt
response = model.generate_content("Write your prompts here.")

# 🖨️ Step: Print the response
print(response.text)
