
import os

files_to_update = [
    '/Users/yunjiseon/workspace/lexcloud26-accounting/src/styles/accounting.css',
    '/Users/yunjiseon/workspace/lexcloud26-accounting/src/styles/style.css',
    '/Users/yunjiseon/workspace/lexcloud26-accounting/src/components/MainLayout.jsx',
    '/Users/yunjiseon/workspace/lexcloud26-accounting/src/components/Accounting/Prepayment.jsx',
    '/Users/yunjiseon/workspace/lexcloud26-accounting/src/components/Accounting/JobFeePage.jsx',
    '/Users/yunjiseon/workspace/lexcloud26-accounting/src/components/Accounting/FilterBar.jsx'
]

replacements = {
    '#ffffff': 'var(--white)',
    '#24313e': 'var(--Black1)',
    '#444444': 'var(--grey-1)', 
    '#f7f8f8': 'var(--neutral_50)',
    '#f0f2f4': 'var(--neutral_100)', 
    '#e8eaec': 'var(--neutral_200)',
    '#dcdfe2': 'var(--neutral_300)',
    '#b9bec1': 'var(--neutral_500)',
    '#a2a6a9': 'var(--neutral_600)',
    '#85888b': 'var(--neutral_700)',
    '#636567': 'var(--neutral_800)',
    '#151616': 'var(--neutral_900)',
    
    '#f7f4ff': 'var(--purple_50)', 
    '#735aff': 'var(--Primary)', 
    '#7c4dff': 'var(--Primary)', 
    '#1c00bd': 'var(--purple_800)',
    '#ef4444': 'var(--red_500)',
    '#000000': 'var(--Color_Base_Black)',

    # Fix Previous Refactor Colors
    'var(--neutral-900)': 'var(--neutral_900)',
    'var(--neutral-800)': 'var(--neutral_800)',
    'var(--neutral-700)': 'var(--neutral_700)',
    'var(--neutral-600)': 'var(--neutral_600)',
    'var(--neutral-500)': 'var(--neutral_500)',
    'var(--neutral-300)': 'var(--neutral_300)',
    'var(--neutral-200)': 'var(--neutral_200)',
    'var(--neutral-100)': 'var(--neutral_100)',
    'var(--neutral-50)': 'var(--neutral_50)',
    'var(--purple-800)': 'var(--purple_800)',
    'var(--purple-600)': 'var(--Primary)', 
    'var(--purple-50)': 'var(--purple_50)',
    'var(--red-500)': 'var(--red_500)',
    'var(--black-1)': 'var(--Black1)',
    'var(--grey-1)': 'var(--grey-1)',

    # Fix Fonts (Map old Kebab to new Underscore/TitleCase)
    # Standard: Body/md/medium -> Body_md_medium
    'var(--body-md-medium-font-family)': 'var(--Body_md_medium_font_family)',
    'var(--body-md-medium-font-weight)': 'var(--Body_md_medium_font_weight)',
    'var(--body-md-medium-font-size)': 'var(--Body_md_medium_font_size)',
    'var(--body-md-medium-line-height)': 'var(--Body_md_medium_line_height)',
    'var(--body-md-medium-letter-spacing)': 'var(--Body_md_medium_letter_spacing)',
    'var(--body-md-medium-font-style)': 'var(--Body_md_medium_font_style)',

    'var(--body-sm-medium-font-family)': 'var(--Body_sm_medium_font_family)',
    'var(--body-sm-medium-font-weight)': 'var(--Body_sm_medium_font_weight)',
    'var(--body-sm-medium-font-size)': 'var(--Body_sm_medium_font_size)',
    'var(--body-sm-medium-line-height)': 'var(--Body_sm_medium_line_height)',
    'var(--body-sm-medium-letter-spacing)': 'var(--Body_sm_medium_letter_spacing)',
    'var(--body-sm-medium-font-style)': 'var(--Body_sm_medium_font_style)',

    'var(--body-sm-regular-font-family)': 'var(--Body_sm_regular_font_family)',
    'var(--body-sm-regular-font-weight)': 'var(--Body_sm_regular_font_weight)',
    'var(--body-sm-regular-font-size)': 'var(--Body_sm_regular_font_size)',
    'var(--body-sm-regular-line-height)': 'var(--Body_sm_regular_line_height)',
    'var(--body-sm-regular-letter-spacing)': 'var(--Body_sm_regular_letter_spacing)',
    'var(--body-sm-regular-font-style)': 'var(--Body_sm_regular_font_style)',

    # Also map any others that might exist but were less frequent
    # If the code used others, I would need to find them.
    # For now, these 3 were the ones visible in accounting.css snippets.
}
# Add uppercase keys
upper_replacements = {k.upper(): v for k, v in replacements.items()}
replacements.update(upper_replacements)

for file_path in files_to_update:
    if not os.path.exists(file_path):
        print(f"Skipping {file_path} (not found)")
        continue
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for hex_code, var_name in replacements.items():
            new_content = new_content.replace(hex_code, var_name)
            
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file_path}")
        else:
            print(f"No changes for {file_path}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
