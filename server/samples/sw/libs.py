#coding: utf-8

import os
import sys
import copy
import glob
import json
import time
import fcntl
import errno
import signal
import socket
import random
import threading
import traceback
import subprocess
import socketserver
from urllib.parse import unquote

from libs.lockfile import LockWait

class API:
    """
    API class for http access to reloader
    with create new method, add it to self.methods list
    """

    def __init__(self, Lock, r_queue, log, w_path = '/ms71/data/superwarden'):
        self.methods = ['reload', 'kill', 'pr_list', 'run',
                        'rep_dir', 'listMethods']
        self.path = w_path
        self.lock = Lock
        self.r_queue = r_queue
        self.exec = sys.executable
        self.log = log

    def listMethods(self, post_m=True):
        """
        return the list of API methods
        """
        
        ret_value = """Manuscript online
 |methods list:
 ||"""
        ret_value = ret_value + u'\n ||'.join(self.methods)
        self.log('listMethods')
        ret_value = '' if post_m else ret_value
        return ret_value

    def reload(self, pid=None, post_m=True):
        """
        reload the service with pid on local service
        """

        ret_value = 'ok'
        rr = None
        if not pid:
            ret_value = """Manuscript online
 |'reload' usage:
 ||GET method
 ||/superwarden?reload=pid1,pid2,pid3
 ||
 ||where pid1, etc - pid number, delimiter - ',' only
 ||
 ||POST method:
 ||
 ||description comming soon
            """
        else:
            rr = self._pid_action(pid, kill=False)
            if rr:
                ret_value = rr
        ret_value = json.dumps(ret_value, ensure_ascii=False) if post_m else ret_value
        return ret_value

    def kill(self, pid=None, post_m=True):
        """
        kill the service with pid on local service
        """

        ret_value = 'ok'
        rr = None
        if not pid:
            ret_value = """Manuscript online
 |'kill' usage:
 ||GET method:
 ||/superwarden?kill=pid1,pid2,pid3
 ||
 ||where pid1, etc - pid number, delimiter - ',' only
 ||
 ||POST method:
 ||
 ||description comming soon
            """
        else:
            rr = self._pid_action(pid, kill=True)
            if rr:
                ret_value = rr
        ret_value = json.dumps(ret_value, ensure_ascii=False) if post_m else ret_value
        return ret_value

    def _pid_action(self, pid, kill=False):
        ret_value = None
        pids = pid.split(',')
        for i_pid in pids:
            if isinstance(i_pid, str):
                i_pid = int(i_pid)
            f_name = os.path.join(self.path, f'{i_pid}.pid')
            if os.path.exists(f_name):
                with self.lock(f_name):
                    pg = os.getpgid(i_pid)
                    os.killpg(pg, signal.SIGINT)
                    if kill:
                        os.remove(f_name)
                        self.log(f'killing pids: {i_pid}')
                    else:
                        self.log(f'reloading pids: {i_pid}')
            else:
                ret_value = 'no such pid file'
        return ret_value

    def rep_dir(self, post_m=True):
        """
        return the list of services in reposiroty with descriptions
        """

        ret_value = ''
        ret_ = ''
        f_index = 'rep_index.idx'
        f_index_path = os.path.join(self.path, f_index)
        data = None
        ret = []
        with open(f_index_path, 'rb') as f_obj:
            data = f_obj.read().decode()
        data = data.split('\n')[1:]
        ret_d = []
        c = 0
        for d_s in data:
            json_ret = {}
            if d_s:
                c += 1
                d_s = json.loads(d_s)
                json_ret['id'] = c
                json_ret['datas'] = d_s
                ret_d.append(json_ret)
                t_stri = []
                for key in d_s:
                    t_stri.append(f'{key}: {d_s[key]}')
                t_stri = '\n'.join(t_stri)
                ret.append(t_stri)
                ret_ = '\n\n'.join(ret)
        self.log('rep_dir')
        ret_value = json.dumps(ret_d, ensure_ascii=False) if post_m else ret_
        return ret_value

    def pr_list(self, post_m=True):
        """
        return the list of running processes on local server
        """
        
        time.sleep(0.22)
        ret_value = ''
        f_list = glob.glob(self.path + '/*.pid')
        rr = []
        ret_list = []
        ret_d = []
        c = 0
        for f_name in f_list:
            if os.path.exists(f_name):
                json_ret = {}
                c += 1
                content = {}
                with self.lock(f_name):
                    pid = os.path.basename(f_name).split('.pid')[0]
                    content['pid'] = pid
                    with open(f_name, 'rb') as f_obj:
                        data = f_obj.read().decode().split('\n')
                for stri in data:
                    key, value = stri.split(': ')
                    content[key] = value
                ret_d.append(copy.deepcopy(content))
                row = json.dumps(content, ensure_ascii=False)
                ret_list.append(row)
                s_name = content.pop('uid')
                ret = []
                for i in list(content.keys()):
                    n = content.pop(i)
                    ret.append(f'{i}: {n}')
                ret = '\n   '.join(m for m in ret)
                ret = '\n   '.join([s_name, ret])
                rr.append(ret)
        #print(ret_list)
        self.log('pr_list')
        ret_value = json.dumps(ret_d, ensure_ascii=False) if post_m else '\n\n'.join(rr)
        return ret_value

    def run(self, name=None, post_m=True):
        """
        run the sevice 'name' from repository with 'n' times
        """

        ret_value = """Manuscript online

 |method 'run': usage:
 ||GET method:
 ||run=servicename,n;servicename2,m;...;servicenameZ,z
 ||
 ||where n, m, z = number of runnig copies of service with same configuration
 ||servicename - name of service in repository (without extention, by default we works with .zip)
 ||
 ||POST method:
 ||
 ||description comming soon
        """
        if name:
            err = []
            try:
                r_list = name.split(';')
            except:
                r_list = [name,]
            c = len(r_list)
            c_r = 0
            for r_name in r_list:
                try:
                    s_name, ind = r_name.split(',')
                except:
                    s_name, ind = r_name, None
                n = int(ind) if ind else 1;
                f_path = self._s_find(s_name)
                if f_path:
                    c_index = self._index_find(s_name)
                    c_r += 1
                    for i in range(n):
                        data = [f_path, f'index={c_index+i+1}']
                        self.r_queue.put_nowait(data)
                else:
                    err.append(s_name)
            if c_r == c:
                ret = u'ok'
                self.log(f'running: {name}')
            else:
                ret = u"""Manuscript online

|method 'run': error:
||
|| services {} absent in repository
        """.format(', '.join(err))
        ret_value = json.dumps(ret_value) if post_m else ret_value
        return ret_value

    def _s_find(self, s_name):
        s_name = s_name + '.zip'
        f_index = 'rep_index.idx'
        f_index_path = os.path.join(self.path, f_index)
        f_path = ''
        with open(f_index_path, 'rb') as f_obj:
            f_data = f_obj.read().decode().split('\n')
        for i in f_data:
            if s_name in i:
                i = json.loads(i)
                f_path = i['full_path']
                f_path =f_path if os.path.basename(f_path) == s_name else ''
                break
        return f_path

    def _index_find(self, s_name=None):
        s_index = 0
        pid_list = glob.glob(self.path + '/*.pid')
        for pid_file in pid_list:
            with open(pid_file, 'rb') as f_obj:
                data = f_obj.read().decode()
            if not s_name in data:
                continue
            data = data.split('\n')
            for data_str in data:
                if 'index' in data_str:
                    c_index = int(data_str.split('index:')[-1].strip())
                    break
            s_index = c_index if c_index > s_index else s_index
        return s_index

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

class UDPServer(socketserver.ThreadingMixIn, socketserver.UDPServer):
    """
    Threading UDP server class
    """
    
    daemon_threads = True
    allow_reuse_address = True
    socket_type = socket.SOCK_DGRAM
    max_packet_size = 8192

    def __init__(self, server_address, RequestHandlerClass, queue, log):
        super(UDPServer, self).__init__(server_address, RequestHandlerClass)
        self.queue = queue
        self.log = log

    def finish_request(self, request, client_address):
        self.RequestHandlerClass(request, client_address,  self, self.queue,)

    def handle_error(self, request, client_address):
        self.log('-'*16)
        self.log('Exception happened during processing of request from', client_address)
        traceback.print_exc() # XXX But this goes to stderr!
        log('='*16)

class UDPHandler:
    """
    handler class for UDPServer
    """
    
    def __init__(self, request, client_address, server, queue=None):
        self.request = request
        self.client_address = client_address
        self.server = server
        self.queue = queue
        self.setup()
        try:
            self.handle()
        finally:
            self.finish()

    def setup(self):
        pass

    def handle(self):
        data = self.request[0].strip().decode()
        data = json.loads(data)
        sock = self.request[1]
        self.queue.put_nowait(data)

    def finish(self):
        pass

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

def udp_start(m_queue=None, log=print, port=4222):
    """
    UDP server start function
    """

    sys.udpserver = UDPServer(("127.0.0.1", port), UDPHandler, queue=m_queue, log=log)
    exit_code = False
    log(f'UDP server started at port {port}')
    try:
        sys.udpserver.serve_forever()
    except KeyboardInterrupt:
        exit_code = 1
    except Exception as e:
        exit_code = e
    return exit_code


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
            pass
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
        data = """location /superwarden/logic {
        #return 200 'key $http_x_api_key';
        if (!-f /ms71/keys/$http_x_api_key.sw) {
        return 403;
        }

        limit_except GET POST HEAD{
            deny all;
        }
        include scgi_params;
        scgi_param                X-BODY-FILE $request_body_file;
        scgi_param                X-API-KEY $http_x_api_key;
        scgi_pass                 superwarden_scgi;
        scgi_buffering            off;
        scgi_cache                off;
    }
    
    location /superwarden {
        add_header Cache_Control no-cache;
        alias html/superwarden;
        #try_files $uri $uri/index.html $uri.html = 404;
        index index.html;
    }
    
    #location /superwarden/login {
    #    add_header Cache_Control no-cache;
    #    try_files $uri $uri/index.html $uri.html = 404;
    #}

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
        data1 = """upstream superwarden_scgi { least_conn;
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

def warden(Lock, r_queue, api):
    """
    function looks for sevices. if the file of service is present, but service didn't run - restart it with
    params from pid file or, if service run, but didn't response more then 5 sec's - force restart it
    """

    time.sleep(5) #sleeps before running
    while True:
        f_list = glob.glob(api.path+'/*.pid')
        for f_name in f_list:
            if os.path.exists(f_name):
                with Lock(f_name):
                    pid = int(os.path.basename(f_name).split('.pid')[0])
                    c_line = f_action(f_name)
                    f_time = os.path.getmtime(f_name)
                    delta = abs(time.time()-f_time)
                    if not is_run(pid):
                        #file pid present, but process is absent - restart it
                        os.remove(f_name)
                        r_queue.put_nowait(c_line)
                    else:
                        #not responding process - no HB from it more then 5 secs
                        if 5 < delta:
                            pg = os.getpgid(pid)
                            os.killpg(pg, signal.SIGINT)
                            os.remove(f_name)
                            r_queue.put_nowait(c_line)
            #else:
                #break
        time.sleep(0.01)

def f_action(f_name):
    """
    utility function for 'warden', reads the data from file and grab 'argv' string
    """

    c_line = []
    try:
        with open(f_name, 'rb') as f_obj:
            data = f_obj.read().decode()
    except:
        data = ''
    ss = data.split('\n')
    for s in ss:
        if 'argv' in s:
            _, st = s.split('argv:')
            c_line = st.strip().split('%%')
            break
    return c_line

def is_run(pid):
    """
    utility function for 'warden', checks the process is alive by pid
    """
    
    ret = True
    try:
        time.sleep(0.01)
        os.kill(pid, 0)
    except OSError:
        ret = False
    if not ret:
        pass
        #print(pid, ret)
    return ret

def _int(x):
    try:
        fx = float(x)
        ix = int(fx)
        return ix if ix == fx else fx
    except:
        return x

def s_run(run_queue):
    """
    function takes the params from queue 'run_queue' and start the service with its using subprocess module
    """

    def _s_run(c_line, stri):
        subprocess.Popen(c_line, start_new_session=True)
        with open('/ms71/data/superwarden/count', 'ab') as f_:
            f_.write(stri.encode())

    c = 0
    while True:
        c_line = [sys.executable,]
        param = None
        try:
            param = run_queue.get()
            run_queue.task_done()
        except Exception as Err:
            #print(Err)
            time.sleep(0.1)
        else:
            if param:
                c += 1
                c_line.extend(param)
                r_time = time.strftime("%Y-%m-%d %H:%M:%S")
                stri = f"{r_time}\ttotal session count: {c},\n    command line: {' '.join(c_line)}\n"
                threading.Thread(target=_s_run, args=(c_line, stri), daemon=True).start()

def s_cheks(Lock, api):
    """
    function looking for new versions of runninig scripts
    it compare the size of script-file and running script-file and if difference - send a command
    to restart it
    """
    
    time.sleep(7) #make a sleep when first-time started before checks updates
    while True:
        f_list = glob.glob(api.path+'/*.pid')
        for f_name in f_list:
            m_time = None
            orig_size = None
            fs_name = None
            if os.path.exists(f_name):
                with Lock(f_name):
                    pid = int(os.path.basename(f_name).split('.pid')[0])
                    try:
                        with open(f_name, 'rb') as f_:
                            datas = f_.read().decode()
                    except:
                        datas=[]
                    if isinstance(datas, str):
                        datas = datas.split('\n')
                    for stri in datas:
                        if 'size' in stri:
                            orig_size = int(stri.split('size:')[-1].strip())
                        elif 'argv' in stri:
                            _, fs_name = stri.split('argv:')
                            fs_name = fs_name.strip().split('%%')[0]
                            try:
                                new_size = os.path.getsize(fs_name)
                            except Exception as Err:
                                new_size = orig_size
                if orig_size != new_size:
                    try:
                        time.sleep(0.5)
                        pg = os.getpgid(pid)
                        os.killpg(pg, signal.SIGINT)
                    except Exception as Err:
                        pass
        time.sleep(0.01)

def parse_args(arg, _param, api, post=True):
    try:
        call = getattr(api, arg)
    except:
        content = u'\'%s\' not implimented method' % arg
    else:
        if _param:
            try:
                content = call(_param, post_m=post)
            except:
                content = u'use \'%s\' with correct parameters' % arg
        else:
            content = call(post_m=post)
    return [content, post]

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

def q_recieve(Lock, m_queue, api):
    """make something with messages from queue"""
    while True:
        try:
            data = m_queue.get()
            m_queue.task_done()
        except:
            time.sleep(0.1)
        else:
            f_name = str(data.pop('pid')) + '.pid'
            f_name = os.path.join(api.path, f_name)
            f_data = []
            for i in list(data.keys()):
                n = data.pop(i)
                f_data.append(f'{i}: {n}')
            f_data = '\n'.join(f_data)
            with Lock(f_name):
                with open(f_name, 'wb') as f_obj:
                    f_obj.write(f_data.encode())

def repos_ind(api, r_path='/ms71/repo'):
    """
    function creates index of files in repository
    """
    if not os.path.exists(r_path):
        os.makedirs(r_path)
    f_index = 'rep_index.idx'
    f_index_path = os.path.join(api.path, f_index)
    sum_times_old = None
    while True:
        sum_times = 0
        rep_f_list = glob.glob(os.path.join(r_path, '*.zip'))
        if os.path.exists(f_index_path):
            for rep_f_name in rep_f_list:
                f_mod_time = int(os.path.getmtime(rep_f_name))
                sum_times += f_mod_time
            with open(f_index_path, 'rb') as f_obj:
                first_line = f_obj.readline().decode().strip()
                if first_line:
                    sum_time_old = int(first_line)
            if sum_times_old == sum_times:
                time.sleep(random.randrange(27000, 54000)/10000)
                continue
        sum_times = 0
        out = []
        f_out = ''
        for rep_f_name in rep_f_list:
            f_params = load_from_file(rep_f_name)
            sum_times += f_params['last_modified_time']
            f_out = json.dumps(f_params, ensure_ascii=False)
            out.append(f_out)
        with open(f_index_path, 'wb') as f_obj:
            f_obj.write((str(sum_times)+'\n').encode())
            f_obj.write('\n'.join(out).encode())
        time.sleep(0.1)

def load_from_file(rep_f_name):
    """
    utility function for repos_ind, gets the params of service, below - example
    """
    f_params = {}
    #example of filling starts here
    f_params['file_name'] = os.path.basename(rep_f_name)
    f_params['service_version'] = 'vesion of file'
    f_params['last_modified_time'] = int(os.path.getctime(rep_f_name))
    f_params['full_path'] = rep_f_name
    f_params['name_of_configuration'] = 'configuration name'
    f_params['service_name'] = 'name of service'
    f_params['service_description'] = 'service description'
    f_params['file_size'] = os.path.getsize(rep_f_name)
    f_params['update_path'] = f"/ms71/repo/upd/{f_params['file_name']}"
    #end of example
    
    return f_params



    
