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
import psycopg2

class API:
    """
    API class for http access to reloader
    """

    def __init__(self, Lock, log, w_path = '/ms71/data/crm', p_path='/ms71/keys'):
        self.methods = []
        self.path = w_path
        self.p_path = p_path
        self.lock = Lock
        self.exec = sys.executable
        self.log = log
        params = {'dbname': 'apps', 'user': 'postgres', 'host': 'localhost'}
        params = {'dbname': 'crm', 'user': 'ms71', 'password': 'iKoosaishohvekohqua1zociGhiSei6w', 'host': '88.99.236.188', 'port': '30000'}
        self.con = psycopg2.connect(**params)

        self.sqls = {'sql_all': """select requests.num, alerts.name, requests.create_date, requests.to_work_date, status.name, users.display_name, points.display_name, topics.name, uu.display_name, requests.description, requests.change_date, current_date, requests.res_desc, customers.display_name
from requests
join alerts
    on alerts.uid = requests.alert
join users
    on users.uid = requests.create_user
join status
    on status.uid = requests.status
join points
    on points.uid = requests.client
join customers
    on customers.uid = points.customer_id
join topics
    on topics.uid = requests.topic
join users as uu
    on uu.uid = requests.ordered
where requests.archived = false and requests.deleted = false and requests.mass = false
order by num desc;
""",
'sql_mass': """select requests.num, alerts.name, requests.create_date, requests.to_work_date, status.name, users.display_name, points.display_name, topics.name, uu.display_name, requests.description, requests.change_date, current_date, requests.res_desc, customers.display_name
from requests
join alerts
    on alerts.uid = requests.alert
join users
    on users.uid = requests.create_user
join status
    on status.uid = requests.status
join points
    on points.uid = requests.client
join customers
    on customers.uid = points.customer_id
join topics
    on topics.uid = requests.topic
join users as uu
    on uu.uid = requests.ordered
where requests.archived = false and requests.deleted = false and requests.mass = true
order by num desc;
""",
'sql_hist': """select requests.num, requests.change_date, points.display_name, topics.name, customers.display_name
from requests
join points
    on points.uid = requests.client
join customers
    on customers.uid = points.customer_id
join topics
    on topics.uid = requests.topic
where requests.archived = true and requests.deleted = false
order by num asc;
""",
'sql_cli': """select num, create_date, topics.name, description, current_date, res_desc
from requests
join topics
    on topics.uid = requests.topic
where requests.deleted = false and requests.num != {0} and requests.client = (select uid from points where display_name = '{1}')
order by num desc;
""",
'sql_top': """select requests.num, requests.create_date, topics.name, requests.description, current_date, requests.res_desc
from requests
join topics
    on topics.uid = requests.topic
where requests.deleted = false and requests.num != {0} and requests.topic = (select uid from topics where name = '{1}')
order by num desc;
""",
'sql_my': """select requests.num, alerts.name, requests.create_date, requests.to_work_date, status.name, users.display_name, points.display_name, topics.name, uu.display_name, requests.description, requests.change_date, current_date, requests.res_desc, customers.display_name
from requests
join alerts
    on alerts.uid = requests.alert
join users
    on users.uid = requests.create_user
join status
    on status.uid = requests.status
join points
    on points.uid = requests.client
join customers
    on customers.uid = points.customer_id
join topics
    on topics.uid = requests.topic
join users as uu
    on uu.uid = requests.ordered
where requests.archived = false and requests.deleted = false and requests.ordered = (select uid from users where display_name = '{0}')
order by num desc;
""",
'sql_ins': """insert into requests (num, alert, create_date, to_work_date, status, create_user, client, topic, ordered, description, archived, deleted, change_date, res_desc, mass) values
    (default, {0}, '{1}', '1971-01-01',
    (select uid from status where name = 'Заведена'),
    (select uid from users where display_name = '{3}'),
    {4}, {5}, 0, '{6}',
    false, false, current_date, '{7}', {8})
    ON CONFLICT DO NOTHING
    RETURNING num;
""",
'sql_update' : """update requests
    set alert = (select uid from alerts where name = '{0}'),
        create_date = '{1}',
        to_work_date = '{2}',
        status = (select uid from status where name = '{3}'),
        create_user = (select uid from users where display_name = '{4}'),
        client = (select uid from points where display_name = '{5}'),
        topic = (select uid from topics where name = '{6}'),
        ordered = (select uid from users where display_name = '{7}'),
        description = '{8}',
        archived = {10},
        deleted = {11},
        change_date = current_date,
        res_desc = '{12}'
    where num = {9}
    returning num;
""",
'sql_ret' : """update requests
    set archived = false,
        change_date = current_date
    where num = {0}
    returning num;
""",
'sql_select_res': """select num, alerts.name, r.create_date, r.to_work_date, status.name, users.display_name, points.display_name, topics.name, uu.display_name, r.description, r.change_date, current_date, r.res_desc, r.mass, customers.display_name
from requests as r
join alerts
    on alerts.uid = r.alert
join users
    on users.uid = r.create_user
join status
    on status.uid = r.status
join points
    on points.uid = r.client
join customers
    on customers.uid = points.customer_id
join topics
    on topics.uid = r.topic
join users as uu
    on uu.uid = r.ordered
where r.archived = false and r.deleted = false and num = {0};
    """,
'sql_get_user': """select * from users where uid = {0};
""",
'sql_upd_user': """update users set
    display_name = '{0}',
    last_name = '{1}',
    first_name = '{2}',
    admin  = {3},
    active = {4},
    deleted = {5},
    phone_number = '{6}',
    int_number = '{7}',
    skype_name = '{8}',
    email = '{9}',
    customer = {10}
    where uid  = {11}
    returning uid;
""",
'sql_points_c': """select * from points where uid > 0 and customer_id = {0};""",
'sql_customer_c': """select * from customers where uid = {0};""",
'sql_point_c': """select * from points where uid = {0};"""
        }

    def get_topics(self, params=None, x_hash=None):
        sql = "select uid, name from topics where uid > 0 order by name asc;"
        cur = self._make_sql(sql)
        rl = []
        for row in cur:
            re_dict = {}
            re_dict["id"]  = row[0]
            re_dict["name"] = row[1]
            rl.append(re_dict)
        cur.close()
        ret_value = json.dumps(rl, ensure_ascii=False)
        return ret_value

    def get_alerts(self, params=None, x_hash=None):
        sql = "select uid, name from alerts order by uid asc;"
        cur = self._make_sql(sql)
        rl = []
        for row in cur.fetchall():
            re_dict = {}
            re_dict["id"]  = str(row[0])
            re_dict["name"] = row[1]
            rl.append(re_dict)
        cur.close()
        ret_value = json.dumps(rl, ensure_ascii=False)
        return ret_value

    def get_c_customer(self, params=None, x_hash=None):
        sql = self.sqls['sql_customer_c'].format(params)
        cur = self._make_sql(sql)
        rl = []
        row = cur.fetchone()
        qw = {"uid": row[0], "display_name": row[1], "full_name": row[2], "address": row[3], "inn": row[4],
              "kpp": row[5], "phone_num": row[6], "email": row[7], "director": row[8],
              "contact": row[9], "create_date": self._f_date(row[10]), "create_user": row[11], "change_date": self._f_date(row[12]),
              "active": row[13], "deleted": row[14], "id_old": row[15]
            }
        rl.append(qw)
        cur.close()
        ret_value = json.dumps(rl, ensure_ascii=False)
        return ret_value

    def get_c_point(self, params=None, x_hash=None):
        sql = self.sqls['sql_point_c'].format(params)
        cur = self._make_sql(sql)
        rl = []
        row = cur.fetchone()
        qw = {"uid": row[0], "display_name": row[1], "customer_id": row[2], "address": row[3], "phone_num": row[4],
              "email": row[5], "contact": row[6], "create_date": self._f_date(row[7]), "create_user": row[8],
              "change_date": self._f_date(row[9]), "active": row[10], "deleted": row[11], "id_old": row[12],
              "comments": row[13]
            }
        rl.append(qw)
        cur.close()
        ret_value = json.dumps(rl, ensure_ascii=False)
        return ret_value

    def get_c_user(self, params=None, x_hash=None):
        sql = self.sqls['sql_get_user'].format(params)
        cur = self._make_sql(sql)
        rl = []
        row = cur.fetchone()
        qw = {"uid": row[0], "display_name": row[1], "last_name": row[2], "first_name": row[3], "admin": row[4],
              "active": row[5], "deleted": row[6], "phone_number": row[7], "int_number": row[8],
              "skype_name": row[9], "email": row[10], "customer": row[11]
            }
        rl.append(qw)
        cur.close()
        ret_value = json.dumps(rl, ensure_ascii=False)
        return ret_value

    def set_c_user(self, params=None, x_hash=None):
        rl = []
        print(params)
        sql = self.sqls['sql_upd_user'].format(params['display_name'], params['last_name'], params['first_name'], params['admin'], params['active'],
                                               params['deleted'], params['phone_number'], params['int_number'], params['skype_name'], params['email'],
                                               params['customer'], params['uid'])
        cur = self._make_sql(sql)
        self.con.commit()
        row = cur.fetchone()[0]
        cur.close()
        #rl = []
        ret_value = self.get_c_user(row)
        #ret_value = json.dumps(rl, ensure_ascii=False)
        return ret_value

    def get_users(self, params=None, x_hash=None):
        sql = "select uid, display_name from users where active=true and deleted=false and uid > 0 order by uid asc;"
        cur = self._make_sql(sql)
        rl = []
        for row in cur.fetchall():
            re_dict = {}
            re_dict["id"]  = row[0]
            re_dict["display_name"] = row[1]
            rl.append(re_dict)
        cur.close()
        ret_value = json.dumps(rl, ensure_ascii=False)
        return ret_value

    def get_clients(self, params=None, x_hash=None):
        sql = "select uid, display_name from customers where uid > 0 order by uid asc;"
        cur = self._make_sql(sql)
        rl = []
        for row in cur.fetchall():
            re_dict = {}
            re_dict["id"]  = row[0]
            re_dict["display_name"] = row[1]
            rl.append(re_dict)
        cur.close()
        ret_value = json.dumps(rl, ensure_ascii=False)
        return ret_value

    def get_c_points(self, params=None, x_hash=None):
        #print(params)
        sql = "select uid, display_name, customer_id from points where uid > 0 and customer_id = {0} order by display_name asc;".format(params)
        cur = self._make_sql(sql)
        rl = []
        for row in cur.fetchall():
            re_dict = {}
            re_dict["id"]  = row[0]
            re_dict["display_name"] = row[1]
            re_dict["customer_id"] = row[2]
            rl.append(re_dict)
        cur.close()
        ret_value = json.dumps(rl, ensure_ascii=False)

        #ret_value = json.dumps('ok', ensure_ascii=False)
        return ret_value

    def get_points(self, params=None, x_hash=None):
        sql = "select uid, display_name, customer_id from points where uid > 0 order by display_name asc;"
        cur = self._make_sql(sql)
        rl = []
        for row in cur.fetchall():
            re_dict = {}
            re_dict["id"]  = row[0]
            re_dict["display_name"] = row[1]
            re_dict["customer_id"] = row[2]
            rl.append(re_dict)
        cur.close()
        ret_value = json.dumps(rl, ensure_ascii=False)
        return ret_value

    def get_reqs_by_topic(self, params=None, x_hash=None):
        """
        получаем все запросы с заданной темой для массовых заявок
        """
        topic = params['topic']
        m_num = params['num']
        sql_top = self.sqls['sql_top'].format(m_num, topic)
        cur = self._make_sql(sql_top)
        rl = []
        for row in cur.fetchall():
            qw = {"num": row[0], "create_date": self._f_date(row[1]), 
                  "topic": row[2], "description" : row[3], "result_desc": row[5]}
            rl.append(qw)
        cur.close()
        ret_value = json.dumps(rl, ensure_ascii=False)
        return ret_value

    def get_reqs(self, params=None, x_hash=None):
        """
        получаем все запросы по заданному клиенту
        """
        #проверяем ключ
        point = params['point']
        m_num = params['num']
        sql_cli = self.sqls['sql_cli'].format(m_num, point)
        cur = self._make_sql(sql_cli)
        rl = []
        for row in cur.fetchall():
            qw = {"num": row[0], "create_date": self._f_date(row[1]), 
                  "topic": row[2], "description" : row[3], "result_desc": row[5]}
            rl.append(qw)
        cur.close()
        ret_value = json.dumps(rl, ensure_ascii=False)
        return ret_value

    def get_all(self, params=None, x_hash=None):
        """
        получаем заявки (все или по пользователю)
        """
        #проверяем ключ
        user = params
        cur = self._make_sql(self.sqls['sql_all'])
        rl = []
        for row in cur.fetchall():
            if row[3] < row[2]:
                work_date = ''
                in_work_d = ''
            else:
                in_work_d = (row[11] - row[3]).days
                work_date = self._f_date(row[3])
            qw = {"alert": row[1], "num": row[0], "create_date": self._f_date(row[2]), "to_work_date": work_date,
                  "status": row[4], "create_user": row[5], "client": row[13], "in_work": in_work_d, "topic": row[7],
                  "ordered": row[8], "description" : row[9], "change_date": self._f_date(row[10]),
                  "res_desc": row[12], "point": row[6]}
            rl.append(qw)
        cur.close()
        ret_value = json.dumps(rl, ensure_ascii=False)
        return ret_value

    def get_mass(self, params=None, x_hash=None):

        #проверяем ключ
        user = params
        cur = self._make_sql(self.sqls['sql_mass'])
        rl = []
        for row in cur.fetchall():
            if row[3] < row[2]:
                work_date = ''
                in_work_d = ''
            else:
                in_work_d = (row[11] - row[3]).days
                work_date = self._f_date(row[3])
            qw = {"alert": row[1], "num": row[0], "create_date": self._f_date(row[2]), "to_work_date": work_date,
                  "status": row[4], "create_user": row[5], "client": row[13], "in_work": in_work_d, "topic": row[7],
                  "ordered": row[8], "description" : row[9], "change_date": self._f_date(row[10]),
                  "res_desc": row[12], "point": row[6]}
            rl.append(qw)
        cur.close()
        ret_value = json.dumps(rl, ensure_ascii=False)
        return ret_value

    def get_hist(self, params=None, x_hash=None):
        """
        получаем заявки (все или по пользователю)
        """
        #проверяем ключ
        user = params
        cur = self._make_sql(self.sqls['sql_hist'])
        rl = []
        for row in cur.fetchall():
            qw = {"num": row[0], "change_date": self._f_date(row[1]),
                  "client": row[4], "topic": row[3], "point": row[2]
                  }
            rl.append(qw)
        cur.close()
        ret_value = json.dumps(rl, ensure_ascii=False)
        return ret_value

    def _f_date(self, date_value):
        return date_value.strftime('%d.%m.%Y')

    def get_my(self, params=None, x_hash=None):
        """
        получаем заявки (все или по пользователю)
        """
        #проверяем ключ
        user = params
        sql_my = self.sqls['sql_my'].format(user)
        
        cur = self._make_sql(sql_my)
        rl = []
        for row in cur.fetchall():
            if row[3] < row[2]:
                work_date = ''
                in_work_d = ''
            else:
                in_work_d = (row[11] - row[3]).days
                work_date = self._f_date(row[3])
            qw = {"alert": row[1], "num": row[0], "create_date": self._f_date(row[2]), "to_work_date": work_date,
                  "status": row[4], "create_user": row[5], "client": row[13], "in_work": in_work_d, "topic": row[7],
                  "ordered": row[8], "description" : row[9], "change_date": self._f_date(row[10]),
                  "res_desc": row[12], 'point': row[6]}
            rl.append(qw)
        cur.close()
        ret_value = json.dumps(rl, ensure_ascii=False)
        return ret_value

    def get_item(self, params=None, x_hash=None):
        """
        get single item for mass
        """
        num = params
        sql = self.sqls['sql_select_res'].format(int(num))
        cur = self._make_sql(sql)
        ret = []
        row = cur.fetchone()
        cur.close()
        if not row:
            return json.dumps('error', ensure_ascii=False)
        if row[3] < row[2]:
            work_date = ''
            in_work_d = ''
        else:
            in_work_d = (row[11] - row[3]).days
            work_date = self._f_date(row[3])
        qw = {"alert": row[1], "num": row[0], "create_date": self._f_date(row[2]), "to_work_date": work_date,
              "status": row[4], "create_user": row[5], "client": row[14], "in_work": str(in_work_d), "topic": row[7],
              "ordered": row[8], "description" : row[9], "change_date": self._f_date(row[10]), "res_desc": row[12], "mass": row[13],
              "point": row[6]}
        ret.append(qw)
        ret_value = json.dumps(ret, ensure_ascii=False)
        return ret_value


    def put_apply(self, params=None, x_hash=None):
        """
        помещаем заявку в базу
        """

        t_date = params['create_date'].split('.')
        t_date.reverse()
        cr_date = '-'.join(t_date)
        if params['mass'] == 0:
            mass = False
            cli = params['client']
            point = params['client_point']
        else:
            mass = True
            cli = 0
            point = 0 
        sql_ins = self.sqls['sql_ins'].format(params['alert'], cr_date, None, params['create_user'], point, params['topic'], params['description'], params['res_desc'], mass)
        ret = None
        cur = self._make_sql(sql_ins)
        try:
            ret = cur.fetchone()
        except Exception as Err:
            print(Err)
        self.con.commit()
        cur.close()
        cur = self._make_sql(self.sqls['sql_select_res'].format(int(ret[0])))
        ret = []
        row = cur.fetchone()
        cur.close()
        if not row:
            return json.dumps('error', ensure_ascii=False)
        if row[3] < row[2]:
            work_date = ''
            in_work_d = ''
        else:
            in_work_d = (row[11] - row[3]).days
            work_date = self._f_date(row[3])
        qw = {"alert": row[1], "num": row[0], "create_date": self._f_date(row[2]), "to_work_date": work_date,
              "status": row[4], "create_user": row[5], "client": row[14], "in_work": str(in_work_d), "topic": row[7],
              "ordered": row[8], "description" : row[9], "change_date": self._f_date(row[10]), "res_desc": row[12], "mass": row[13],
              "point": row[6]}
        ret.append(qw)
        ret_value = json.dumps(ret, ensure_ascii=False)
        return ret_value

        
        num = ret[0] if ret else 0
        ret_value = json.dumps(num, ensure_ascii=False)
        return ret_value

    def _make_sql(self, sql):
        """
        Создаем курсор и делаем sql запрос
        """
        cur = self.con.cursor()
        try:
            cur.execute(sql)
        except Exception as Err:
            print(Err)
        return cur

    def ret_row(self, params=None, x_hash=None):
        sql_ret = self.sqls['sql_ret'].format(params['num'])
        cur = self._make_sql(sql_ret)
        self.con.commit()
        if cur.fetchone():
            ret_value = 'ok'
        else:
            ret_value = 'err'
        return json.dumps(ret_value, ensure_ascii=False)

    def update_row(self, params=None, x_hash=None):
        """
        делаем апдейт строки таблицы запросов
        """
        cr_date = params['create_date'].split('.')
        cr_date.reverse()
        cr_date = '-'.join(cr_date)
        if params['to_work_date']:
            temp_date = params['to_work_date'].split()
            if len(temp_date) > 1:
                tw_date = temp_date[0]
            else:
                tw_date = params['to_work_date'].split('.')
                tw_date.reverse()
                tw_date = '-'.join(tw_date)
        else:
            tw_date = '1971-01-01'
        arch = params.get('archived', False)
        deleted = params.get('deleted', False)
        sql_update = self.sqls['sql_update'].format(params['alert'], cr_date, tw_date, params['status'], params['create_user'],
                   params['point'], params['topic'], params['ordered'], params['description'],
                   params['num'], arch, deleted, params['res_desc'])
        ret = None
        cur = self._make_sql(sql_update)
        self.con.commit()
        try:
            ret = cur.fetchone()
        except Exception as Err:
            print(Err)
        cur.close()
        cur = self._make_sql(self.sqls['sql_select_res'].format(int(ret[0])))
        ret = []
        row = cur.fetchone()
        cur.close()
        if not row:
            ret_value = json.dumps('ok', ensure_ascii=False)
        else:
            if row[3] < row[2]:
                work_date = ''
                in_work_d = ''
            else:
                in_work_d = (row[11] - row[3]).days
                work_date = self._f_date(row[3])
            qw = {"alert": row[1], "num": row[0], "create_date": self._f_date(row[2]), "to_work_date": work_date,
                  "status": row[4], "create_user": row[5], "client": row[6], "in_work": str(in_work_d), "topic": row[7],
                  "ordered": row[8], "description" : row[9], "change_date": self._f_date(row[10]), "res_desc": row[12]}
            ret.append(qw)
            ret_value = json.dumps(ret, ensure_ascii=False)
        return ret_value

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
    
    #location /crm/options {
    #    add_header Cache_Control no-cache;
    #    alias html/crm/options;
    #    index options.html;
    #    #try_files $uri $uri/index.html $uri/options.html $uri.html =404;
    #}
    
    location /crm {
        add_header Cache_Control no-cache;
        alias html/crm;
        index index.html;
    #    try_files $uri $uri/index.html $uri.html =404;
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
