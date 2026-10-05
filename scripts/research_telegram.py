"""Read every publicly accessible page of the club's Telegram channel."""
from pathlib import Path
import json,re,time
import requests
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/'.tmp/telegram-archive'
DEST.mkdir(parents=True,exist_ok=True)
session=requests.Session()
session.headers['User-Agent']='Mozilla/5.0'
base='https://t.me/s/asdrealfut5al'
url=base
messages={}
seen=set()
page=0
while url not in seen:
    seen.add(url)
    for attempt in range(4):
        try:
            response=session.get(url,timeout=40)
            response.raise_for_status()
            break
        except requests.RequestException:
            if attempt==3: raise
            time.sleep(2*(attempt+1))
    soup=BeautifulSoup(response.text,'html.parser')
    page+=1
    (DEST/f'page-{page:03}.html').write_text(response.text,encoding='utf-8')
    ids=[]
    for item in soup.select('.tgme_widget_message[data-post]'):
        post=item['data-post']
        post_id=int(post.split('/')[-1])
        ids.append(post_id)
        stamp=item.select_one('time')
        text=item.select_one('.tgme_widget_message_text')
        photos=[]
        for photo in item.select('.tgme_widget_message_photo_wrap'):
            match=re.search(r"background-image:\s*url\(['\"]?(.*?)['\"]?\)",photo.get('style',''))
            if match:
                photos.append({'source':photo.get('href'),'url':match[1]})
        messages[post_id]={'id':post_id,'source':'https://t.me/'+post,
            'published_at':stamp.get('datetime') if stamp else None,
            'text':text.get_text('\n',strip=True) if text else '',
            'photos':photos,'video':bool(item.select_one('video'))}
    (DEST/'messages.json').write_text(json.dumps(sorted(messages.values(),key=lambda m:m['id']),ensure_ascii=False,indent=2),encoding='utf-8')
    if page%5==0:
        print(f'Pages {page}; messages {len(messages)}; earliest post {min(messages) if messages else "?"}',flush=True)
    previous=soup.select_one('a.tme_messages_more[data-before]')
    if not previous:
        previous=soup.select_one('a.tme_messages_more[href*="before="]')
    if previous:
        href=previous.get('href','')
        next_url='https://t.me'+href if href.startswith('/') else href
        if next_url and next_url not in seen:
            url=next_url
            continue
    if ids and min(ids)>1:
        next_url=base+'?before='+str(min(ids))
        if next_url not in seen:
            url=next_url
            continue
    break
photos=sum(len(m['photos']) for m in messages.values())
summary={'pages':page,'messages':len(messages),'photos':photos,
    'first_post':min(messages) if messages else None,'last_post':max(messages) if messages else None,
    'first_date':messages[min(messages)]['published_at'] if messages else None,
    'last_date':messages[max(messages)]['published_at'] if messages else None,
    'last_url':url}
(DEST/'summary.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
print(json.dumps(summary),flush=True)
