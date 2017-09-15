#coding: utf-8

__appname__ = 'superwarden'
__version__ = '2017.255.1430' #remove GET access
#__version__ = '2017.254.1800' #minor updates
#__version__ = '2017.220.1200' #fix errors with 'reload' and services updates
#__version__ = '2017.219.1700' #reads the 'index' param  of run scripts and adds it to starting one.
#__version__ = '2017.219.1640' #add logging for executing api methods
#__version__ = '2017.219.1450' #add api methods
#__version__ = '2017.216.1520' #correct errors with API
#__version__ = '2017.216.1300' #superwarden service with autoupdater
__profile__ = ""
__index__   =-1

import os
import sys
import json
import time
import uuid
import queue
import os.path
import threading
import traceback
import itertools
import multiprocessing
from urllib.parse import unquote

import libs.libs as libs

def main():
    w_path = '/ms71/data/superwarden'
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
    m_queue = queue.Queue()
    st_queue = queue.Queue()
    sys.APPCONF["params"], sys.APPCONF["kwargs"] , __profile__, __index__ = libs.handle_commandline(__profile__, __index__)
    sys.APPCONF["addr"] = sys.APPCONF["kwargs"].pop("addr", sys.APPCONF["addr"])
    sys.APPCONF["log"] = libs.logs(hostname=None, version=__version__, appname=__appname__, profile=__profile__)
    sys.APPCONF["api"] = libs.API(Lock=sys.APPCONF['Lock'], r_queue = st_queue, log = sys.APPCONF["log"], w_path = w_path)
    sys.intip = None #internal ip
    sys.extip = None #external ip
    sys.udpserver = None #udp server
    sys.guid = uuid.uuid4().hex #unique guid
    ret_code = None

    threads, processes = prepare_server(m_queue=m_queue, st_queue=st_queue, Lock=sys.APPCONF['Lock'], api = sys.APPCONF["api"])
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
            libs.shutdown(sys.APPCONF["log"])
        except:
            sys.APPCONF["log"](traceback.format_exc(), kind="error:shutdown")
    return (rc)

def application(env):
    """main bussiness script"""
    addr, pid = env["scgi.initv"][:2]
    msg = f'{addr[0]} {addr[1]} {env["HTTP_METHOD"]} {env["URI"]} {env["HTTP_PARAMS"]} {env["HTTP_KWARGS"]}'
    env["scgi.defer"] = lambda: sys.APPCONF["log"]("%s close" % msg)
    sys.APPCONF["log"](msg)
    ret_code = '200 OK'
    content = u"""Manuscript online
    
 | serving superwarden SCGI Server
 | use  POST requests only with single method.
 | if you use more then one method - Server takes the method randomly
"""
    _rm = env["HTTP_METHOD"].upper()
    args=None
    if 'GET' == _rm:
        pass
        """
        _param = None
        arg = None
        if env["HTTP_PARAMS"]:
            _qs = env["HTTP_PARAMS"]
            g = (v.strip() for v in itertools.chain.from_iterable(item.split(',') for item in _qs))
            args = list(filter(lambda x: x, g))
            arg=args.pop(0)
            content = libs.parse_args(arg, _param, sys.APPCONF['api'], post=False)
        elif env["HTTP_KWARGS"]:
            arg, _param = env["HTTP_KWARGS"].popitem()
            content = libs.parse_args(arg, _param, sys.APPCONF['api'], post=False)
        """
    elif 'POST' == _rm:
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
            content = libs.parse_args(arg, _param, sys.APPCONF['api'], post=True)
    # три обязательных вызова yield: статус, заголовки, содержание
    if isinstance(content, list):
        ret_value = content[0].encode()
        header = libs.head(len(ret_value), False, content[1])
    else:
        ret_value = content.encode()
        header = libs.head(len(ret_value), False, False)
    yield ret_code
    yield header
    yield ret_value

def prepare_server(m_queue, st_queue, Lock=None, api = None):
    """prepare the server, loading all bussiness-logic threads"""
    upd = '/ms71/repo/upd'
    if not os.path.exists(api.path):
        os.makedirs(api.path)
    if not os.path.exists(upd):
        os.makedirs(upd)
    while not sys.extip:
        sys.extip, sys.intip = libs.getip(sys.APPCONF["log"])
    threads = []
    processes = []
    sys.APPCONF["log"](f'{__appname__} started.\tinternal ip-> {sys.intip}')
    sys.APPCONF["log"](f'\t\t\textrnal  ip-> {sys.extip}')
    threads.append(threading.Thread(target=libs.q_recieve, args=(Lock, m_queue, api), daemon=True))
    threads.append(threading.Thread(target=libs.udp_start, args=(m_queue, sys.APPCONF["log"]), daemon=True))
    threads.append(threading.Thread(target=libs.warden, args=(Lock, st_queue, api), daemon=True))
    threads.append(threading.Thread(target=libs.s_run, args=(st_queue, ), daemon=True))
    threads.append(threading.Thread(target=libs.s_cheks, args=(Lock, api), daemon=True))
    threads.append(threading.Thread(target=libs.repos_ind, args=(api,), daemon=True))
    #thread looks for new versions of ALL scripts, storing in repository, from the sources and uploading the new ones
    #and then replace the old file with new, and then move the old one to 'old' dir,
    for th in threads:
        th.start()
    for pr in processes:
        pr.start()
    return threads, processes

###############################################

if "__main__" == __name__:
    import libs._updater as up
    up.run_reloader(
        main,
        update_path=[
                '/ms71/repo/upd/superwarden.zip',
                #'http://update.url',
            ],
        interval=5
    )
