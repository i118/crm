#coding: utf-8

import os
import sys
import glob
import json
import time
import uuid
import fcntl
import errno
import socket
import hashlib
import threading
import traceback
import subprocess
from urllib.parse import unquote
from libs.lockfile import LockWait

#"2012.05.06"
data_2 = [
{"alert": 2, "num": 1, "create_date": "2012.05.06", "to_work_date": "2012.05.08", "status":"В работе", "create_user": "Тарасов", "client": "Парацельс Плюс", "in_work": 3, "topic": "Не накладные", "ordered": "Кашинцев", "description" : "11212"},
{"alert": 1, "num": 2, "create_date": "2012.05.06", "to_work_date": "2012.05.08", "status":"В работе", "create_user": "Тарасов", "client": "Парацельс Плюс", "in_work": 3, "topic": "пришли накладные", "ordered": "Кашинцев", "description" : "11212"},
{"alert": 2, "num": 3, "create_date": "2012.05.06", "to_work_date": "2012.05.08", "status":"В работе", "create_user": "Тарасов", "client": "Парацельс минусПлюс", "in_work": 1, "topic": "Не пришли", "ordered": "Кашинцев", "description" : "11212"},
{"alert": 3, "num": 4, "create_date": "2012.05.06", "to_work_date": "2012.05.08", "status":"В работе", "create_user": "Тарасов", "client": "Парацельс Плюс", "in_work": 3, "topic": "Не накладные", "ordered": "Кашинцев", "description" : "11212"},
{"alert": 3, "num": 5, "create_date": "2012.05.06", "to_work_date": "2012.05.08", "status":"В работе", "create_user": "Тарасов", "client": "Парацельс минусПлюс", "in_work": 4, "topic": "Не пришли накладные", "ordered": "Кашинцев", "description" : "11212"},
{"alert": 3, "num": 6, "create_date": "2012.05.06", "to_work_date": "2012.05.08", "status":"В работе", "create_user": "Тарасов", "client": "Парацельс Плюс", "in_work": 3, "topic": "Не накладные", "ordered": "Кашинцев", "description" : "11212"},
{"alert": 3, "num": 8, "create_date": "2012.05.06", "to_work_date": "2012.05.08", "status":"В работе", "create_user": "Тарасов", "client": "Парацельс минусПлюс", "in_work": 6, "topic": "Не пришли", "ordered": "Кашинцев", "description" : "11212"},
{"alert": 3, "num": 9, "create_date": "2012.05.06", "to_work_date": "2012.05.08", "status":"В работе", "create_user": "Тарасов", "client": "Парацельс Плюс", "in_work": 3, "topic": "Не пришли накладные", "ordered": "Кашинцев", "description" : "11212"},
{"alert": 3, "num": 10, "create_date": "2012.05.06", "to_work_date": "2012.05.08", "status":"В работе", "create_user": "Тарасов", "client": "Парацельс Плюс", "in_work": 4, "topic": "Не пришли", "ordered": "Тарасов", "description" : "11212"},
{"alert": 3, "num": 11, "create_date": "2012.05.06", "to_work_date": "2012.05.08", "status":"В работе", "create_user": "Тарасов", "client": "Парацельс минус", "in_work": 2, "topic": "Не пришли накладные", "ordered": "Тарасов", "description" : "11212"},
{"alert": 1, "num": 12, "create_date": "2012.05.06", "to_work_date": "2012.05.08", "status":"В работе", "create_user": "Тарасов", "client": "Партнер-Инвест ООО Московская Область, г. Серпухов, Мишина проезд, 7", "in_work": 3, "topic": "Не пришли накладные", "ordered": "Кашинцев", "description" : "11212"},
{"alert": 2, "num": 13, "create_date": "2012.05.06", "to_work_date": "2012.05.08", "status":"В работе", "create_user": "Тарасов", "client": "Парацельс минус", "in_work": 3, "topic": "Не пришли накладные", "ordered": "Тарасов", "description" : "11212"},
{"alert": 0, "num": 14, "create_date": "2012.05.06", "to_work_date": "2012.05.08", "status":"В работе", "create_user": "Тарасов", "client": "Парацельс Плюс", "in_work": 3, "topic": "Не пришли накладные", "ordered": "Кашинцев", "description" : "11212"},
{"alert": 1, "num": 15, "create_date": "2012.05.06", "to_work_date": "2012.05.08", "status":"В работе", "create_user": "Тарасов", "client": "Парацельс минус", "in_work": 3, "topic": "Не пришли накладные", "ordered": "Кашинцев", "description" : "11212"},
{"alert": 2, "num": 1650, "create_date": "2012.05.06", "to_work_date": "2012.05.08", "status":"В работе", "create_user": "Тарасов", "client": "Парацельс Плюс", "in_work": 3, "topic": "Не пришли накладные", "ordered": "Кашинцев", "description" : "11212"},
{"alert": 2, "num": 10650, "create_date": "2012.05.06", "to_work_date": "2012.05.08", "status":"В работе", "create_user": "Тарасов", "client": "Парацельс Плюс", "in_work": 3, "topic": "Не пришли накладные", "ordered": "Кашинцев", "description" : "11212"}
]

clients = ['Парацельс Плюс', 'Партнер-Инвест ООО Московская Область, г. Серпухов, Мишина проезд, 7',
           'Минус', 'арацельс минусПлюс',
           'Парацельс Минус', 'Парацельс минусПлюс']

users = ["Тарасов", "Кашинцев", 'user', 'userrrr']

topics = ["...", "Не накладные", "пришли накладные", "Не пришли", "Не пришли накладные"] 

class API:
    """
    API class for http access to reloader
    """

    def __init__(self, Lock, log, w_path = '/ms71/data/crv', p_path='/ms71/keys'):
        self.methods = ['login', 'logout']
        self.path = w_path
        self.p_path = p_path
        self.lock = Lock
        self.exec = sys.executable
        self.log = log
        self.data2 = data_2

    def get_topics(self, params=None, x_hash=None):
        ret_value = json.dumps(topics, ensure_ascii=False)
        return ret_value

    def get_users(self, params=None, x_hash=None):
        ret_value = json.dumps(users, ensure_ascii=False)
        return ret_value

    def get_clients(self, params=None, x_hash=None):
        ret_value = json.dumps(clients, ensure_ascii=False)
        return ret_value

    def get_all(self, params=None, x_hash=None):
        """
        получаем заявки (все или по пользователю)
        """
        #проверяем ключ
        user = params
        ret_value = json.dumps(self.data2, ensure_ascii=False)
        return ret_value

    def get_my(self, params=None, x_hash=None):
        """
        получаем заявки (все или по пользователю)
        """
        #проверяем ключ
        user = params
        datas = []
        for row in self.data2:
            if user != row['ordered']:
                continue
            datas.append(row)
            #print(row)
        
        ret_value = json.dumps(datas, ensure_ascii=False)
        return ret_value


    def get_mass(self, params=None, x_hash=None):
        """
        получаем массовые заявки (еще бы узнать что это и как выглядят)
        """
        #проверяем ключ
        user = params
        ret_value = json.dumps(data_3, ensure_ascii=False)
        return ret_value

    def get_history(self, params=None, x_hash=None):
        """
        получаем историю заявок
        """
        #проверяем ключ
        user = params
        ret_value = json.dumps(data_4, ensure_ascii=False)
        return ret_value

    def put_apply(self, params=None, x_hash=None):
        """
        помещем заявку в базу
        """
        params['alert'] = 3
        params['num'] = len(self.data2) + 1
        params['to_work_date'] = ''
        params['status'] = 'Заведена'
        params['in_work'] = 0
        params['ordered'] = ''
        cr_date = params['create_date'].split()[0].split('-')
        #cr_date.reverse()
        cr_date = '.'.join(cr_date)
        params['create_date'] = cr_date
        self.data2.append(params)
        #print(self.data2[0])
        #print(self.data2[-1])
        #print(params)
        ret_value = json.dumps('bla-bla-bla', ensure_ascii=False)
        return u''


class fLock:
    """
    File locking class. Intended for use with the `with` syntax.
    """

    def __init__(self, path):
        self._path = path
        self._fd = None

    def __enter__(self):
        self._fd = os.open(self._path, os.O_CREAT)
        while True:
            try:
                fcntl.flock(self._fd, fcntl.LOCK_EX | fcntl.LOCK_NB) # try to acquire the Lock
                return
            except (OSError, IOError) as ex:
                if ex.errno != errno.EAGAIN: # Resource temporarily unavailable
                    raise
            time.sleep(0.01)

    def __exit__(self, *args):
        fcntl.flock(self._fd, fcntl.LOCK_UN)
        os.close(self._fd)
        self._fd = None

def getip(log):
    """
    get ip's function
    """
    
    _urls = ('https://sklad71.org/consul/ip/', 'http://ip-address.ru/show','http://yandex.ru/internet',
        'http://ip-api.com/line/?fields=query', 'http://icanhazip.com', 'http://ipinfo.io/ip',
        'https://api.ipify.org')
    s = r"[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}"
    eip = None
    iip = ''
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as se:
            se.connect(("77.88.8.8", 80))
            iip = se.getsockname()[0]
    except Exception as e:
        log(f"err:{str(e)}")
    import ssl, re, urllib.request
    ssl._create_default_https_context = ssl._create_unverified_context
    for url in _urls:
        r = None
        data = ''
        try:
            with urllib.request.urlopen(url, timeout=2) as r:
                data = str(r.headers)
                data += r.read().decode()
                eip = re.findall(s, data)[0].strip()
                break
        except Exception as e:
            continue
    return eip, iip


class logs:
    """
    logging class
    """
    
    def __init__(self, hostname=None, version=None, appname=None, profile=None):
        self.hostname = hostname
        self.version = version
        self.appname = appname
        self.profile = profile

    def __call__(self, msg, kind='info', begin='', end='\n'):
        try:
            ts = "%Y-%m-%d %H:%M:%S"
            try: ts = time.strftime(ts)
            except: ts = time.strftime(ts)
            if self.hostname:
                if self.profile:
                    s = '{0}{1} {2} {4}.{5}:{3}:{6} {7}{8}'.format(begin, ts, self.hostname, self.version, self.appname, self.profile, kind, msg, end)
                else:
                    s = '{0}{1} {2} {4}:{3}:{5} {6}{7}'.format(begin, ts, self.hostname, self.version, self.appname, kind, msg, end)
            else:
                if self.profile:
                    s = '{0}{1} {3}.{4}:{2}:{5} {6}{7}'.format(begin, ts, self.version, self.appname, self.profile, kind, msg, end)
                else:
                    s = '{0}{1} {3}:{2}:{4} {5}{6}'.format(begin, ts, self.version, self.appname, kind, msg, end)
            sys.stdout.write(s)
            sys.stdout.flush()
        except:
            traceback.print_exc()

class SCGIServer:
    """
    SCGI Server class
    """
    
    def __init__(self, log, hostname=None, version=None, appname=None, profile=None, index=None):
        self.log = log
        self.hostname = hostname
        self.version = version
        self.appname = appname
        self.profile = profile
        self.index = index

    def serve_forever(self, addr, handle_request):
        sock = None
        if type(addr) is str:
            sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        else:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(addr)
        #sock.listen(10)
        initial_value = None
        initial_value = self._init(sock)
        try:
            while True:
                _conn, _addr = sock.accept()
                _t = threading.Thread(target=self._handle_conn, args=(_conn, _addr, handle_request, initial_value))
                _t.env = None
                _t.daemon = True
                _t.start()
        finally:
            try: sock.close()
            except: pass
            
    def _handle_conn(self, conn, addr, handle_request, initial_value):
        env = None
        try:
            conn.settimeout(1)
            rfile = conn.makefile("rb", -1)
            wfile = conn.makefile("wb", 0)
            env = self._env_read(rfile)
            env = self._args_parse(env)
            env["scgi.defer"] = None
            env["scgi.initv"] = initial_value
            env["scgi.rfile"] = rfile
            env["scgi.wfile"] = wfile
            env["CONTENT_LENGTH"] = int(env["CONTENT_LENGTH"])
            threading.current_thread().env = env
            g = handle_request(env)
            wfile.write("Status: {0}\r\n".format(g.__next__()).encode())
            wfile.flush()
            for kv in g.__next__():
                wfile.write(": ".join(kv).encode())
                wfile.write(b"\r\n")
            wfile.write(b"\r\n")
            wfile.flush()
            for data in g:
                wfile.write(data)
                wfile.flush()
        except (BrokenPipeError) as e:
            pass
        except:
            self.log(conn)
            self.log(env)
            traceback.print_exc()
        finally:
            if not wfile.closed:
                try: wfile.flush()
                except: pass
            try: wfile.close()
            except: pass
            try: rfile.close()
            except: pass
            try: conn.shutdown(socket.SHUT_WR)
            except: pass
            try: conn.close()
            except: pass
            if env and env.get("scgi.defer"):
                try:
                    env["scgi.defer"]()
                except:
                    self.log(traceback.format_exc(), kind="error:defer")

    def _env_read(self, f):
        size, d = f.read(16).split(b':', 1)
        size = int(size)-len(d)
        if size > 0:
            s = f.read(size)
            if not s:
                raise IOError('short netstring read')
            if f.read(1) != b',':
                raise IOError('missing netstring terminator')
            items =  b"".join([d, s]).split(b'\0')[:-1]
        else:
            raise IOError('missing netstring size')
        assert len(items) % 2 == 0, "malformed headers"
        env = {}
        while items:
            v = items.pop()
            k = items.pop()
            env[k.decode()] = v.decode()
        return env

    def _args_parse(self, env):
        args = []
        argd = {}
        for x in env.pop('ARGS', '').split('&'):
            i = x.find('=')
            if i > -1:
                k, x  = x[:i], x[i+1:]
            else:
                k = None
            if k:
                argd[unquote(k)] = unquote(x)
            else:
                if x:
                    args.append(unquote(x))
        env['HTTP_PARAMS'] = args
        env['HTTP_KWARGS'] = argd
        return env

    def _init(self, sock):
        addr = sock.getsockname()[:2]
        sock.listen(100)
        sys.APPCONF["addr"] = addr
        fileupstream = self._getfilename("upstream")
        sys.APPCONF["fileupstream"] = fileupstream
        data = """location /crm_logic {
        #if (!-f /ms71/keys/$http_x_api_key.sw) {
        #return 403;
        #}

        limit_except POST HEAD{
            deny all;
        }
        include scgi_params;
        #scgi_param                X-BODY-FILE $request_body_file;
        scgi_param                X-API-KEY $http_x_api_key;
        scgi_pass                 crm_l;
        scgi_buffering            off;
        scgi_cache                off;
    }
    
    location /crm {
        add_header Cache_Control no-cache;
        alias html/crm;
        index index.html;
    }
    
    """
        filelocation = self._getfilename("location")
        dn = os.path.dirname(filelocation)
        bs = os.path.basename(filelocation)
        _filelocation = os.path.join(dn, bs.split('.', 1)[0].split('-', 1)[0])  # общий файл для всех экземпляров приложения
        with open(_filelocation, "wb") as f:
            f.write(data.encode())
        sys.APPCONF["filelocation"] = _filelocation
        dn = os.path.dirname(fileupstream)
        bs = os.path.basename(fileupstream)
        _fileupstream = os.path.join(dn, bs.split('.', 1)[0].split('-', 1)[0])  # общий файл для всех экземпляров приложения
        _fileupstreamlock = bs.split('.', 1)[0].split('-', 1)[0]  # _fileupstream + '.lock'
        data1 = """upstream crm_l {
        least_conn;
        server %s:%s;  # %s
    }
    """ % (addr[0], addr[1], bs)
        data2 = """#   server %s:%s;  # %s""" % (addr[0], addr[1], bs)
        with LockWait(_fileupstreamlock):
            if os.path.exists(_fileupstream):
                with open(_fileupstream, "rb") as f:
                    src = f.read().decode().rstrip().splitlines()
                    # + ' ' + data[1:] + '\n}\n'
                _find = "# %s" % bs
                # fg - пердполагаем, что надо добавлять свой апстрим
                fg = True
                for i in range(1, len(src)-1):
                    if src[i].find(_find) >-1:
                        fg = False
                        src[i] = ' ' + data2[1:]
                        break
                if fg:
                    src[len(src)-1] = ' ' + data2[1:] + '\n}\n'
                src = '\n'.join(src)
                with open(_fileupstream, "wb") as f:
                    f.write(src.encode())
            else:
                with open(_fileupstream, "wb") as f:
                    f.write(data1.encode())
        rc = 0
        rc = subprocess.call(['sudo', 'nginx', '-t', '-c', '/ms71/saas.conf', '-p', '/ms71/'])
                             #stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if 0 == rc:
            rc = subprocess.call(['sudo', 'nginx', '-s', 'reload', '-c', '/ms71/saas.conf', '-p', '/ms71/'])
            if 0 == rc:
                self.log("%s:%s running" % addr)
                return [addr, os.getpid()]
        raise SystemExit(rc)

    def _getfilename(self, name):
        filename = ""
        if self.index > -1:
            if self.profile:
                filename = os.path.join(sys.APPCONF["nginx"][name], "%s-%s.%s" % (self.appname, self.index, self.profile))
            else:
                filename = os.path.join(sys.APPCONF["nginx"][name], "%s-%s" % (self.appname, self.index))
        else:
            if self.profile:
                filename = os.path.join(sys.APPCONF["nginx"][name], "%s.%s" % (self.appname, self.profile))
            else:
                filename = os.path.join(sys.APPCONF["nginx"][name], self.appname)
        return filename

def head(aContentLength, fgDeflate=True, fg_head=True):
    """
    make a header of response function
    """
    
    aLastModified = time.strftime('%a, %d %b %Y %X GMT', time.gmtime())
    r = []
    r.append(("Last-Modified", "%s" % aLastModified))
    r.append(("Content-Length", "%i" % aContentLength))
    r.append(("X-Accel-Buffering", "no"))
    if fg_head:
        r.append(("Content-Type", "application/json"))
    else:
        r.append(("Cache-Control", "no-cache"))
        r.append(("Content-Type", "text/plain; charset=UTF-8"))
    if fgDeflate:
        r.append(("Content-Encoding", "deflate"))
    return r
        
def shutdown(log):
    """
    function, runs when exiting
    """
    
    fileupstream = sys.APPCONF.get("fileupstream")
    if fileupstream is None:
        log("%s:%s critical" % sys.APPCONF["addr"], begin='')
        return
    try:
        os.remove(fileupstream)
    except: pass
    dn = os.path.dirname(fileupstream)
    bs = os.path.basename(fileupstream)
    _fileupstream = os.path.join(dn, bs.split('.', 1)[0].split('-', 1)[0])
    _fileupstreamlock = bs.split('.', 1)[0].split('-', 1)[0]
    with LockWait(_fileupstreamlock):
        _find = "# %s" % bs
        src = ""
        fg_noapp = True
        if os.path.exists(_fileupstream):
            with open(_fileupstream, "rb") as f:
                src = f.read().decode().rstrip().splitlines()
            for i in range(1, len(src)-1):
                if src[i].find(_find) >-1:
                    src.pop(i)
                    break
            fg_noapp = 0 == len(src[1:-1])
        if fg_noapp:  # нет запущенных приложений, удаляем общую локацию и апстрим
            try:
                os.remove(sys.APPCONF["filelocation"])
            except: pass
            try:
                os.remove(_fileupstream)
            except: pass
        else:
            src = '\n'.join(src)
            with open(_fileupstream, "wb") as f:
                f.write(src.encode())
    
    subprocess.call(['sudo', 'nginx', '-s', 'reload', '-c', '/ms71/saas.conf', '-p', '/ms71/'])
    log("%s:%s shutdown" % sys.APPCONF["addr"], begin='')

def _int(x):
    try:
        fx = float(x)
        ix = int(fx)
        return ix if ix == fx else fx
    except:
        return x

def parse_args(arg, _param, x_hash, api):
    try:
        call = getattr(api, arg)
    except:
        content = u'\'%s\' not implimented method' % arg
    else:
        if x_hash:
            try:
                content = call(_param, x_hash)
            except:
                print('-'*20)
                print('error calling', _param, x_hash)
                print(traceback.format_exc())
                print('-'*20)
                content = u'use \'%s\' with correct parameters' % arg
        else:
            content = u'login please'
    return content

def handle_commandline(profile, index):
    args = []
    kwargs = {}
    sys.stdin.close()
    _argv = sys.argv[1:]
    for x in _argv:
        i = x.find('=')
        if i > -1:
            k, x  = x[:i], x[i+1:]
        else:
            k = None
        if k:
            v = unquote(x).split(',')
            if len(v) > 1:
                kwargs[unquote(k)] = tuple(_int(x) for x in v)
            else:
                kwargs[unquote(k)] = _int(v[0])
        else:
            if x:
                v = unquote(x).split(',')
                if len(v) > 1:
                    args.append(tuple(libs._int(x) for x in v))
                else:
                    args.append(_int(v[0]))
    if "profile" in kwargs:
        profile = kwargs.pop("profile")
    if "index" in kwargs:
        index = kwargs.pop("index")
    return args, kwargs, profile, index

def clear_keys(w_path):
    """
    remove all keys
    """

    f_list = glob.glob(f'{w_path}/*.sw')
    for f_ in f_list:
        try:
            os.remove(f_)
        except: pass


class UDPSocket(socket.socket):

    def __init__(self, bind_addr=('127.0.0.1', 0), std_addr=('127.0.0.1', 4222),
                 family=socket.AF_INET, type=socket.SOCK_DGRAM, proto=0, _sock=None):
        super(UDPSocket, self).__init__(family=family, type=type, proto=proto)
        try: self.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        except: pass
        try: self.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEPORT, 1)
        except: pass
        self.bind(bind_addr)
        self._buf = []
        self._std_addr = std_addr

    def write(self, text):
        fg = False
        if isinstance(text, str):
            self._buf.append(text.encode())
            fg = text.rfind('\n') > -1
        else:
            self._buf.append(text)
            fg =  text.rfind(b'\n') > -1
        if fg:
            data = b''.join(self._buf)[:8192]
            self._buf.clear()
            return self.sendto(data, self._std_addr)

    def flush(self):
        pass

    def readlines(self):
        return self.recv(8192)

    def read(self, n=8192):
        return self.recv(n)
