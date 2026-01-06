import os
import re

def resolve_conflict(content):
    # This regex matches the conflict markers
    # Case 1: Standard markers
    # <<<<<<< HEAD
    # content A
    # =======
    # content B
    # >>>>>>> hash
    
    pattern = re.compile(r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> .*?\n', re.DOTALL)
    
    def replacement(match):
        content_github = match.group(1)
        content_local = match.group(2)
        
        # If they are identical, keep one
        if content_github.strip() == content_local.strip():
            return content_github + "\n"
        
        # In most of our cases, the local changes (second block) are the 'premium' edits
        # However, let's look for clues. If one has 'supabase' or 'premium' and the other doesn't...
        # For now, let's assume the SECOND block (local changes) is what we want to preserve.
        # BUT, the user said HEAD is 'content from GitHub'. 
        return content_local + "\n"

    # Handle nested conflicts by repeating
    new_content = content
    for _ in range(5): # Up to 5 levels of nesting
        old_content = new_content
        new_content = pattern.sub(replacement, new_content)
        if new_content == old_content:
            break
            
    # Also handle some malformed ones seen in index.css (empty blocks)
    new_content = re.sub(r'<<<<<<< HEAD\n=======\n>>>>>>> .*?\n', '', new_content)
    
    return new_content

root_dir = r'c:\Users\admin\OneDrive\Desktop\ai-ailliance-uz'
for root, dirs, files in os.walk(root_dir):
    if '.git' in dirs:
        dirs.remove('.git')
    if 'node_modules' in dirs:
        dirs.remove('node_modules')
        
    for file in files:
        if file.endswith(('.jsx', '.js', '.css', '.json', '.html', '.md')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if '<<<<<<< HEAD' in content:
                    print(f"Resolving conflicts in {path}")
                    new_content = resolve_conflict(content)
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
            except Exception as e:
                print(f"Error processing {path}: {e}")
