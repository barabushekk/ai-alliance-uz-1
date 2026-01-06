import os
import re

def resolve_conflicts(content):
    # This regex is designed to catch the standard Git conflict block
    # and pick the second block (local changes) which usually contains the desired "premium" code.
    # It also handles nested markers by repeatedly applying the transformation.
    
    # Pattern for standard conflict:
    # <<<<<<< HEAD
    # [block 1]
    # =======
    # [block 2]
    # >>>>>>> [hash]
    
    pattern = re.compile(r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> .*?\n', re.DOTALL)
    
    current = content
    while True:
        # Also handle empty/nested markers that look like:
        # <<<<<<< HEAD
        # =======
        # >>>>>>> hash
        # (This happens when one side is empty)
        
        new = pattern.sub(r'\2\n', current)
        
        # Handle cases where the marker is not followed by a newline at the very end
        new = re.sub(r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> .*?$', r'\2', new, flags=re.DOTALL)
        
        # Strip specific mess seen in index.css: <<<<<<< HEAD\n<<<<<<< HEAD\n=======\n>>>>>>> hash
        new = re.sub(r'<<<<<<< HEAD\n<<<<<<< HEAD\n=======\n>>>>>>> .*?\n', '', new)
        new = re.sub(r'<<<<<<< HEAD\n=======\n>>>>>>> .*?\n', '', new)

        if new == current:
            break
        current = new
    
    # Final pass to remove any stray markers that might have survived unconventional nesting
    current = re.sub(r'^<<<<<<< HEAD.*$\n', '', current, flags=re.MULTILINE)
    current = re.sub(r'^=======.*$\n', '', current, flags=re.MULTILINE)
    current = re.sub(r'^>>>>>>> .*$\n', '', current, flags=re.MULTILINE)
    
    return current

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.git' in dirs:
            dirs.remove('.git')
            
        for file in files:
            if file.endswith(('.jsx', '.js', '.css', '.json', '.html', '.md', '.env')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if '<<<<<<< HEAD' in content or '>>>>>>>' in content:
                        print(f"Cleaning {path}...")
                        new_content = resolve_conflicts(content)
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                except Exception as e:
                    print(f"Error in {path}: {e}")

if __name__ == "__main__":
    base_path = r"c:\Users\admin\OneDrive\Desktop\ai-ailliance-uz"
    process_directory(base_path)
    print("Done.")
