#coding: utf-8

__appname__ = 'crm_client'
__version__ = '2017.257.1500' #crm клиент первая редакция

__profile__ = ""
__index__   =-1

import os
import sys
import json
import time
import uuid
import queue
import os.path
import random
import threading
import traceback
#import itertools
#import multiprocessing
from urllib.parse import unquote

import libs.libs as libs

def main():
    w_path = '/ms71/data/crv'
    p_path = '/ms71/keys'
    sys.extip = None
    sys.intip = None
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
    sys.APPCONF["api"] = libs.API(Lock=sys.APPCONF['Lock'], log = sys.APPCONF["log"], w_path = w_path, p_path=p_path)

    threading.Thread(target=s_send, args=(), daemon=True).start()

    threads, processes = prepare_server(Lock=sys.APPCONF['Lock'], api = sys.APPCONF["api"])
    rc = 0
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
            libs.clear_keys(w_path)
            libs.shutdown(sys.APPCONF["log"])
        except:
            sys.APPCONF["log"](traceback.format_exc(), kind="error:shutdown")
    return (rc)

def application(env):
    """main bussiness script"""
    addr, pid = env["scgi.initv"][:2]
    msg = f'{addr[0]} {addr[1]} {env["HTTP_METHOD"]} {env["URI"]} {env["HTTP_PARAMS"]} {env["HTTP_KWARGS"]}'
    env["scgi.defer"] = lambda: sys.APPCONF["log"]("%s close" % msg)
    #print(env['X-API-KEY'])
    sys.APPCONF["log"](msg)
    ret_code = u'200 OK'
    content = u''
    _rm = env["HTTP_METHOD"].upper()
    args=None

    if 'POST' == _rm:
        args = env['scgi.rfile'].read(env['CONTENT_LENGTH'])
        try:
            args = zlib.decompress(args)
        except Exception as Err:
            pass
        try:
            args = json.loads(args)
            sys.APPCONF["log"](args)
        except Exception as Err:
            content = u'not applicable format. use JSON-formated string'
            #print(Err)
        else:
            arg, _param = args.popitem()
            content = libs.parse_args(arg, _param, env['X-API-KEY'], sys.APPCONF['api'])
            
    # три обязательных вызова yield: статус, заголовки, содержание
    ret_value = content.encode()
    header = libs.head(len(ret_value), False, True)
    yield ret_code
    yield header
    yield ret_value

def prepare_server(Lock=None, api = None):
    """prepare the server, loading all bussiness-logic threads"""

    if not os.path.exists(api.path):
        os.makedirs(api.path)
    if not os.path.exists(api.p_path):
        os.makedirs(api.p_path)
    libs.clear_keys(api.path)
    while not sys.extip:
        sys.extip, sys.intip = libs.getip(sys.APPCONF["log"])
    threads = []
    processes = []
    sys.APPCONF["log"](f'{__appname__} started.\tinternal ip-> {sys.intip}')
    sys.APPCONF["log"](f'\t\t\textrnal  ip-> {sys.extip}')
    
    #threads.append(threading.Thread(target=libs.warden, args=(Lock, st_queue, api), daemon=True))

    for th in threads:
        th.start()
    for pr in processes:
        pr.start()
    return threads, processes

def s_send():
    import json

    udpsock = libs.UDPSocket()
    pid = os.getpid() #pid of service
    uid = uuid.uuid4().hex #guid of service
    a_path = f'https://online365.pro/crm_logic' #path for access from outside
    w_p = os.path.abspath(sys.argv[0])#full path to running script.
    f_size = os.path.getsize(w_p) #size of running file
    m_time = os.path.getmtime(w_p) #last modify time of running file
    sys.argv[0] = w_p
    argv = '%%'.join(m for m in sys.argv) #formated string from sys.argv
    while True: #infinite loop for heart beating
        p_d = {'appname': __appname__, 'version': __version__, 'profile': __profile__, 'index': __index__, 'pid': pid, 'uid': uid,
               'extip': sys.extip, 'intip': sys.intip, 'nginx path': a_path, 'argv': argv, 'm_time': m_time, 'size': f_size}
        payload = json.dumps(p_d, ensure_ascii=False) #heart beat message, it needs to discuss
        print(payload, file=udpsock) #send to UDP socket our message
        time.sleep(1.5 + random.random())


###############################################

if "__main__" == __name__:
    main()

