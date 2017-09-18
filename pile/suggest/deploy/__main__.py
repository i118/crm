# coding: utf-8

__appname__ = "suggest"
__version__ = "17.255.1800" #make for superwarden
#__version__ = "17.207.1300" #автоапдейт сервиса через модуль
#__version__ = "17.205.1300" #делаем автоапдейт сервиса
#__version__ = "17.179.1520" #если с товаром раньше ничего не покупалось, возвращаем пустую строку
#__version__ = "17.179.1130" #поправили конфигурацию nginx
#__version__ = "17.177.1650" #делаем программу suggest с загрузкой из базы clickhouse
__profile__ = ""
__index__   =-1

import os
import sys
import time
import uuid
import socket
import random
import traceback
import threading
import itertools

import libs.libs as libs

def main():

    global __profile__, __index__
    sys.APPCONF = {
        "Lock": libs.fLock,
        "params": [],
        "kwargs": {},
        "addr": ("127.0.0.1", 0),
        "nginx": {
            "location": "/ms71/conf/location",
            "upstream": "/ms71/conf/upstream",
        },
    }
    sys.APPCONF["params"], sys.APPCONF["kwargs"] , __profile__, __index__ = libs.handle_commandline(__profile__, __index__)
    sys.APPCONF["addr"] = sys.APPCONF["kwargs"].pop("addr", sys.APPCONF["addr"])
    sys.APPCONF["log"] = libs.logs(hostname=None, version=__version__, appname=__appname__, profile=__profile__)
    rc = 0
    threading.Thread(target=s_send, args=(), daemon=True).start()
    try:
        server = libs.SCGIServer(sys.APPCONF["log"], hostname=None, version=__version__,
                                 appname=__appname__, profile=__profile__, index=__index__)
        server.serve_forever(sys.APPCONF["addr"], application)
    except KeyboardInterrupt as e:
        pass
    except SystemExit as e:
        if e:
            rc = e.code
    except:
        sys.APPCONF["log"](traceback.format_exc(), kind="error")
    finally:
        try:
            libs.shutdown(sys.APPCONF["log"])
        except:
            sys.APPCONF["log"](traceback.format_exc(), kind="error:shutdown")
            log(traceback.format_exc(), kind="error:finit")
    os._exit(rc)

def application(env):

    from libs.suggest2 import main2
    addr, pid = env["scgi.initv"][:2]
    msg = f'{addr[0]} {addr[1]} {env["HTTP_METHOD"]} {env["URI"]} {env["HTTP_PARAMS"]} {env["HTTP_KWARGS"]}'
    env["scgi.defer"] = lambda: sys.APPCONF["log"]("%s close" % msg)
    sys.APPCONF["log"](msg)
    ret_code = u'200 OK'
    header = libs.head()
    content = u''
    _rm = env["HTTP_METHOD"].upper()
    args=None
    if 'GET' == _rm:
        _qs = env["HTTP_PARAMS"]
        g = (v.strip() for v in itertools.chain.from_iterable(item.split(',') for item in _qs))
        args = set(filter(lambda x: x, g))
        if args:
            content = main2(args)
        else:
            content = u"""Манускрипт Онлайн

 Сервис SGG
 По заданному списку кодов товаров из эталонного справочника
возвращает список рекомендованных товаров

Пример использования (метод GET):
  https://online365.pro/sgg?20249&48406
  https://online365.pro/sgg?6471,15533
  https://online365.pro/sgg?20249&48406,15533
"""
    ret_value = content.encode()
    # три обязательных вызова yield: статус, заголовки, содержание
    yield ret_code
    yield header
    yield ret_value

def s_send():
    import json
    udpsock = libs.UDPSocket()
    pid = os.getpid() #pid of service
    uid = uuid.uuid4().hex #guid of service
    extip, intip = libs.getip()
    a_path = f'https://online365.pro/sgg' #path for access from outside
    w_p = os.path.abspath(sys.argv[0])#full path to running script.
    f_size = os.path.getsize(w_p) #size of running file
    m_time = os.path.getmtime(w_p) #last modify time of running file
    sys.argv[0] = w_p
    argv = '%%'.join(m for m in sys.argv) #formated string from sys.argv
    while True: #infinite loop for heart beating
        p_d = {'appname': __appname__, 'version': __version__, 'profile': __profile__, 'index': __index__, 'pid': pid, 'uid': uid,
               'extip': extip, 'intip': intip, 'nginx path': a_path, 'argv': argv, 'm_time': m_time, 'size': f_size}
        payload = json.dumps(p_d, ensure_ascii=False) #heart beat message, it needs to discuss
        print(payload, file=udpsock) #send to UDP socket our message
        time.sleep(2 + random.random())

if "__main__" == __name__:
    main()

