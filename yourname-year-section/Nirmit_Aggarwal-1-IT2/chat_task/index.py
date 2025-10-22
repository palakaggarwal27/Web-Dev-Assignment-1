import tkinter as tk
from tkinter import messagebox, scrolledtext, font as tkfont
from tkhtmlview import HTMLLabel
import requests
import csv
from datetime import datetime
import markdown

# --- API Configuration ---
API_URL = "https://api.longcat.chat/openai/v1/chat/completions"
API_KEY = "ak_1WR1Wy2yT3714a72Ec3sj7Ew03E5z"  # replace with your API key
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# --- Color Scheme ---
COLORS = {
    "primary": "#6C63FF",      # Main purple
    "secondary": "#FF6B6B",    # Coral accent
    "background": "#F8F9FE",   # Light gray background
    "text": "#2D3748",        # Dark gray text
    "light_text": "#718096",  # Lighter text for subtitles
    "white": "#FFFFFF",       # Pure white
    "input_bg": "#EDF2F7"     # Light input background
}

# --- CSV Logging ---
LOG_FILE = "chat_log.csv"
with open(LOG_FILE, "a", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["timestamp", "role", "message"])

def log_message(role, message):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(LOG_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([timestamp, role, message])

# --- UI Setup ---
root = tk.Tk()
root.title("Sparks")
root.geometry("800x600")
root.configure(bg=COLORS["background"])

# Create header frame
header_frame = tk.Frame(root, bg=COLORS["background"], height=80)
header_frame.pack(fill=tk.X, padx=20, pady=(20, 10))
header_frame.pack_propagate(False)

# Main title
title_label = tk.Label(
    header_frame,
    text="Sparks",
    font=("Poppins", 24, "bold"),
    fg=COLORS["primary"],
    bg=COLORS["background"]
)
title_label.pack(anchor="w")

# Subtitle
subtitle_label = tk.Label(
    header_frame,
    text="made by nirmit aggarwal",
    font=("Poppins", 12),
    fg=COLORS["light_text"],
    bg=COLORS["background"]
)
subtitle_label.pack(anchor="w")

# Create main chat frame with custom styling
chat_container = tk.Frame(
    root,
    bg=COLORS["white"],
    bd=0,
    highlightthickness=1,
    highlightbackground=COLORS["primary"],
    highlightcolor=COLORS["primary"]
)
chat_container.pack(fill=tk.BOTH, expand=True, padx=20, pady=(0, 10))

# Chat Frame (Scrollable)
chat_frame = scrolledtext.ScrolledText(
    chat_container,
    wrap=tk.WORD,
    state=tk.DISABLED,
    bg=COLORS["white"],
    fg=COLORS["text"],
    font=("Roboto", 12),
    relief=tk.FLAT,
    bd=0,
    highlightthickness=0,
)
chat_frame.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)

# Custom scrollbar styling
chat_frame.vbar.configure(
    troughcolor=COLORS["background"],
    bg=COLORS["primary"],
    width=8,
    activebackground=COLORS["secondary"]
)

def insert_html(content, prefix="Sparks"):
    """Render Markdown content as HTML and insert into chat."""
    html = markdown.markdown(content)
    chat_frame.config(state=tk.NORMAL)
    
    # Add message prefix with custom styling
    chat_frame.tag_configure(
        "prefix",
        foreground=COLORS["primary"],
        font=("Poppins", 11, "bold")
    )
    chat_frame.insert(tk.END, f"{prefix}: \n", "prefix")

    # Create HTML widget with custom styling
    html_widget = HTMLLabel(
        chat_frame,
        html=html,
        background=COLORS["white"],
        fg=COLORS["text"],
        width=80,
    )
    chat_frame.window_create(tk.END, window=html_widget)
    chat_frame.insert(tk.END, "\n\n")
    chat_frame.config(state=tk.DISABLED)
    chat_frame.yview(tk.END)

def send_message():
    user_input = user_entry.get().strip()
    if not user_input:
        return

    chat_frame.config(state=tk.NORMAL)
    # Style user messages
    chat_frame.tag_configure(
        "user",
        foreground=COLORS["text"],
        font=("Roboto", 12)
    )
    chat_frame.tag_configure(
        "user_prefix",
        foreground=COLORS["secondary"],
        font=("Poppins", 11, "bold")
    )
    
    chat_frame.insert(tk.END, "You: ", "user_prefix")
    chat_frame.insert(tk.END, f"{user_input}\n\n", "user")
    chat_frame.config(state=tk.DISABLED)
    chat_frame.yview(tk.END)
    user_entry.delete(0, tk.END)
    log_message("user", user_input)

    try:
        payload = {
            "model": "LongCat-Flash-Chat",
            "messages": [{"role": "user", "content": user_input}],
            "max_tokens": 1000,
            "temperature": 0.7
        }
        response = requests.post(API_URL, headers=HEADERS, json=payload)
        response.raise_for_status()
        data = response.json()
        ai_message = data["choices"][0]["message"]["content"].strip()

        insert_html(ai_message)
        log_message("assistant", ai_message)

    except Exception as e:
        messagebox.showerror("Error", f"Something went wrong:\n{e}")

# Create modern input area
input_frame = tk.Frame(root, bg=COLORS["background"], height=60)
input_frame.pack(fill=tk.X, padx=20, pady=(0, 20))

# Custom Entry widget with modern styling
entry_container = tk.Frame(
    input_frame,
    bg=COLORS["primary"],
    padx=1,
    pady=1,
    bd=0,
)
entry_container.pack(side=tk.LEFT, fill=tk.X, expand=True)

user_entry = tk.Entry(
    entry_container,
    bg=COLORS["input_bg"],
    fg=COLORS["text"],
    font=("Roboto", 12),
    relief=tk.FLAT,
    bd=0,
    insertbackground=COLORS["primary"],
)
user_entry.pack(fill=tk.BOTH, expand=True, ipady=8, padx=10)
user_entry.bind("<Return>", lambda event: send_message())

# Modern send button
send_button = tk.Button(
    input_frame,
    text="Send",
    command=send_message,
    bg=COLORS["primary"],
    fg=COLORS["white"],
    font=("Poppins", 11, "bold"),
    relief=tk.FLAT,
    bd=0,
    padx=20,
    pady=8,
    cursor="hand2"
)
send_button.pack(side=tk.RIGHT, padx=(10, 0))

# Hover effect for send button
def on_enter(e):
    send_button['background'] = COLORS["secondary"]

def on_leave(e):
    send_button['background'] = COLORS["primary"]

send_button.bind("<Enter>", on_enter)
send_button.bind("<Leave>", on_leave)

# Start the application
root.mainloop()
