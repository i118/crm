# coding: utf-8

import sys, os, time, itertools
import urllib.request
import urllib.parse
import random
#from datetime import datetime

def main2(args=None):
    data = ""
    if args:
        check = set()
        for arr in args:
            elem = None
            try:
                elem = int(arr)
            except: pass
            if elem:
                check.add(elem)
        print(check)
        items = sgg(check)
        
        if items:
            #data = '\n'.join("%s %s" % (nm, ','.join(list(nms)[:3])) for nm, [cnt, nms, ids] in items)
            data = '\n'.join("%s %s" % (nm, ','.join(sorted(nms, reverse=True)[:3])) for nm, [cnt, nms, ids] in items)
    return data

def sgg(check):
    s1 = """select ids, cnt, tvr from
(select ID_SPR1, ID_SPR2 as ids, CNT2 as cnt from sales.CNT where ID_SPR1 in ({0}))
any inner join (select ID_SPR as ids, Tovar as tvr from sales.SPR where ID_SPR not in ({0})) using ids order by cnt desc
"""
    s1 = s1.format(','.join('%s' % (i, ) for i in check))
    sql2 = "select ID_SPR, Tovar from sales.SPR where ID_SPR in ({0});".format(','.join('%s' % (i, ) for i in check))
    host='http://localhost:8123/'
    #host='http://82.202.204.159:8123/'
    params = urllib.parse.quote(s1.replace('\n', ''))
    params1 = urllib.parse.quote(sql2)
    url1 = f'{host}?query={params1}'
    url = f'{host}?query={params}'
    c1 = 0
    c2 = 0
    _d = {}
    ret = []
    tovar_exclude = {u"ПАКЕТ", u"ШПРИЦ", u"ИГЛА", u"ЛЕЙКОПЛАСТЫРЬ", u"БИНТ", u"ВАТА ", u" ВАТН",
                     u"БАХИЛЫ "} #товары, исключаемые из обработки
    fl = False
    _nm_exists = set()
    goods = []
    for kod, nm in click_exec(url1):
        if not (kod and nm):
            continue
        kod = int(kod)
        nm = str(nm)
        goods.append([kod, nm])
        _nm_key2 = nm.strip().split()[:2]
        if len(_nm_key2) < 2:
            _nm_key2.append("")
        _nm_key1 = _nm_key2[0]
        _nm_key2 = _nm_key2[1]
        #_nm_exists.add(_nm_key1)
        _nm_exists.update(nm.split())
    _nm_exists_txt = ' '.join(sorted(_nm_exists))

    for kod, kol, nm in click_exec(url):
        kod = int(kod)
        kol = int(kol)
        nm = str(nm)
        c1 += 1
        if nm[0] in u"1234567890":
            fl = True
        for nnm in tovar_exclude:
            if nnm in nm:
                fl=True
                break
        if fl:
            fl=False
            continue
        c2 += 1
        s = nm.strip().split()[:3]
        # обрезаем гласные на конце ключ-слова
        _k = _kk = s[0].split('-')[0]
        while _k:
            #if _k[-1] in u"АЕЁИЙОУЯ":
            if _k[-1] in u"АЕЁИЙУЯ":
                _k = _k[:-1]
            else:
                break
        if len(_k) / float(len(_kk)) < 0.50:
            _k = _kk
        if len(_k) < 4:
            _k = _kk[:4]
        #проверяем на совпадение названия в чеке и в аналогах
        if _k in _nm_exists_txt:
            #pass
            continue
        while len(s) < 3:
            s.append('')
        if len(_k) < 5:
            _nm_key1 = _k + ' ' + s[1]
            _nm_key2 = s[2]
        else:
            _nm_key1 = _k
            _nm_key2 = s[1]
        if _nm_key1 in _d:
            _d[_nm_key1][0] = _d[_nm_key1][0] + kol
            if len(_nm_key2) > 2:
                _d[_nm_key1][1].add(_nm_key2.lower())
            _d[_nm_key1][2].add(kod)
        else:
            if len(_nm_key2) > 2:
                _d[_nm_key1] = [kol, set([_nm_key2.lower(),]), set([kod,])]
    dd = sorted(_d.items(), key=lambda kv: kv[1][0], reverse=True)
    u = 0
    for kk in dd:
        u += 1
        #print(kk)
        if u > 6:
            break
        if u > 3: #выводим 4, 5 и 6 элементы сверху
            ret.append(kk)
    return ret

def click_exec(url):
    headers = {}
    #print(url)
    try:
        f = urllib.request.urlopen(urllib.request.Request(url, data=None, headers=headers), timeout=2+random.random())
    except Exception as Err:
        print(Err)
    else:
        for line in f:
            kkk = line.decode().strip().split('\t')
            yield kkk


if "__main__" == __name__:
    t1 = time.time()
    data = main2(sys.argv[1:])
    data = main2({71741,})
    if data:
        print(data, flush=True)
    t2 = time.time()
    print(time.strftime("Total executed time: %H:%M:%S", time.gmtime(t2 - t1)), flush=True)
    print(t2-t1, flush=True)

