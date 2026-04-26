# -*- coding: utf-8 -*-
"""
index.html / index.html.txt 파일 무결성 전체 검사
"""

import os

files_to_check = [
    r"C:\Users\user\.gemini\antigravity\scratch\the-well-service\index.html",
    r"C:\Users\user\.gemini\antigravity\scratch\the-well-service\index.html.txt",
]

for file_path in files_to_check:
    print(f"\n{'='*60}")
    print(f"FILE: {os.path.basename(file_path)}")
    print(f"PATH: {file_path}")

    if not os.path.exists(file_path):
        print("  [ERROR] 파일 없음")
        continue

    with open(file_path, 'rb') as f:
        content = f.read()

    lines = content.split(b'\n')
    print(f"  Lines     : {len(lines)}")
    print(f"  Size      : {len(content):,} bytes")

    # UTF-8 검사
    utf8_errors = []
    for i, line in enumerate(lines):
        try:
            line.decode('utf-8')
        except UnicodeDecodeError as e:
            utf8_errors.append((i+1, str(e)))

    if utf8_errors:
        print(f"  [!] UTF-8 오류: {len(utf8_errors)}줄")
        for ln, e in utf8_errors[:5]:
            print(f"      Line {ln}: {e}")
    else:
        print(f"  [OK] UTF-8 인코딩 정상")

    # 손상 문자(U+FFFD) 검사
    if b'\xef\xbf\xbd' in content:
        count = content.count(b'\xef\xbf\xbd')
        print(f"  [!] U+FFFD 손상 문자 {count}개 발견")
    else:
        print(f"  [OK] 손상 문자(U+FFFD) 없음")

    # DetailPage 복원 확인
    if b'const DetailPage' in content and b'const BoardPage' in content:
        dp_pos = content.index(b'const DetailPage')
        bp_pos = content.index(b'const BoardPage')
        if dp_pos < bp_pos:
            print(f"  [OK] DetailPage/BoardPage 구조 정상")
        else:
            print(f"  [!] DetailPage/BoardPage 순서 오류")
    else:
        print(f"  [!] 컴포넌트 구조 확인 불가")

    # 핵심 컴포넌트 존재 여부
    components = [b'const Header', b'const Hero', b'const BrandStory',
                  b'const Services', b'const QuoteForm', b'function App']
    missing = [c.decode() for c in components if c not in content]
    if missing:
        print(f"  [!] 누락 컴포넌트: {missing}")
    else:
        print(f"  [OK] 모든 핵심 컴포넌트 존재")

    # HTML 구조
    if b'<!DOCTYPE html>' in content and b'</html>' in content:
        print(f"  [OK] HTML 시작/끝 태그 정상")
    else:
        print(f"  [!] HTML 구조 오류")

print("\n" + "="*60)
print("검사 완료")
