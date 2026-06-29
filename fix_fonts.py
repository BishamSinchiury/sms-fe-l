import os
import re

DIR = '/home/bisham/Code/sms-no-ai/fe/src'

def scale_font_sizes(content):
    # Mapping old values to new values
    replacements = {
        r'font-size:\s*0\.7rem': 'font-size: 0.85rem',
        r'font-size:\s*0\.72rem': 'font-size: 0.85rem',
        r'font-size:\s*0\.73rem': 'font-size: 0.85rem',
        r'font-size:\s*0\.75rem': 'font-size: 0.9rem',
        r'font-size:\s*0\.76rem': 'font-size: 0.9rem',
        r'font-size:\s*0\.78rem': 'font-size: 0.95rem',
        r'font-size:\s*0\.8rem': 'font-size: 0.95rem',
        r'font-size:\s*0\.81rem': 'font-size: 0.95rem',
        r'font-size:\s*0\.82rem': 'font-size: 0.95rem',
        r'font-size:\s*0\.83rem': 'font-size: 1rem',
        r'font-size:\s*0\.97rem': 'font-size: 1.2rem',
        
        # padding fixes for badges and small buttons
        r'padding:\s*2px 8px': 'padding: 4px 10px',
        r'padding:\s*0\.28rem 0\.65rem': 'padding: 0.4rem 0.8rem',
        r'padding:\s*0\.42rem 0\.9rem': 'padding: 0.5rem 1rem',
        r'padding:\s*0\.44rem 1rem': 'padding: 0.5rem 1.1rem',
        r'padding:\s*0\.44rem 0\.9rem': 'padding: 0.5rem 1rem',
        r'padding:\s*0\.44rem 1\.15rem': 'padding: 0.5rem 1.25rem',
        r'padding:\s*0\.4rem 0\.7rem': 'padding: 0.5rem 0.9rem',
        r'padding:\s*0\.4rem 2rem 0\.4rem 2rem': 'padding: 0.5rem 2.2rem 0.5rem 2.2rem',
        r'padding:\s*0\.48rem 0\.75rem': 'padding: 0.6rem 0.75rem',
        r'padding:\s*0\.55rem 1rem': 'padding: 0.65rem 1rem',
    }
    
    new_content = content
    for old, new in replacements.items():
        new_content = re.sub(old, new, new_content)
    
    # Catch any remaining small font sizes
    def rem_scaler(match):
        val = float(match.group(1))
        if val < 0.85:
            new_val = min(val + 0.15, 0.95)
            return f"font-size: {new_val:.2f}rem".rstrip('0').rstrip('.') + "rem"
        return match.group(0)
    
    new_content = re.sub(r'font-size:\s*([0-9.]+)rem', rem_scaler, new_content)
    
    return new_content

files_modified = 0
for root, _, files in os.walk(DIR):
    for f in files:
        if f.endswith('.module.css'):
            path = os.path.join(root, f)
            with open(path, 'r') as file:
                content = file.read()
                
            new_content = scale_font_sizes(content)
            
            if new_content != content:
                with open(path, 'w') as file:
                    file.write(new_content)
                files_modified += 1
                print(f"Updated {f}")

print(f"Done. Modified {files_modified} files.")
