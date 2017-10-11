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
import collections

import psycopg2


sql_cre = collections.OrderedDict([('cre_alerts', """create table if not exists alerts (
uid int primary key,
name text);"""),
('cre_status', """create table if not exists status (
uid int primary key,
name text);"""),
('cre_topics', """create table if not exists topics (
uid int primary key,
name text);"""),
('cre_users', """create table if not exists users (
uid serial primary key,
display_name text unique,
last_name text,
first_name text,
admin boolean,
active boolean,
deleted boolean,
phone_number text,
int_number text,
skype_name text,
email text,
customer boolean,
unique (last_name, first_name));"""),
('cre_customers', """create table if not exists customers (
uid serial primary key,
display_name text unique,
full_name text,
address text,
inn int unique,
kpp int,
phone_num text,
email text,
director text,
contact text,
create_date date,
create_user int references users,
change_date date,
active boolean,
deleted boolean,
ogrn int,
dt date,
tarif text,
edo text,
sms_phone text,
position text,
based text,
in_person text,
u_address text array[8],
p_address text array[8],
bik text,
bank_name text,
kor_account int,
r_account int,
new_rozn text,
old_rozn text,
sklad text,
c_summ text,
expect_summ text,
comment text,
notify text,
string text,
aliases text array,
template text,
id_old text,
client boolean,
supplier boolean
);"""),
('cre_points', """create table if not exists points (
uid serial primary key,
display_name text unique,
customer_id int references customers,
address text,
phone_num text,
email text,
contact text,
create_date date,
create_user int references users,
change_date date,
active boolean,
deleted boolean,
id_old text,
comments text
);"""),
('cre_req', """create table if not exists requests (
num serial primary key,
alert int references alerts,
create_date date,
to_work_date date,
status int references status,
create_user int references users,
client int references clients,
topic int references topics,
ordered int references users,
description text,
archived boolean,
deleted boolean,
change_date date,
res_desc text,
mass boolean);""")
])
sql_ins = collections.OrderedDict([('alerts_ins', """insert into alerts (uid, name) values (0, 'Высокий'), (1, 'Средний'), (2, 'Низкий'), (3, 'Обычный');"""),
('topics_ins', """insert into topics (uid, name) values
(1, 'Ошибка в программе'),
(2, 'Пожелания и предложения'),
(3, 'Прочее'),
(4, 'Настройка АРМ Розница'),
(5, 'Настройка АРМ Склад'),
(6, 'Настройка Прайс-Лист Эксперт'),
(7, 'Настройка строннего ПО'),
(8, 'Не работает интернет'),
(9, 'Проблема с оборудованием'),
(10, 'Настройка справочника'),
(11, 'Настройка почты'),
(12, 'Настройка обработки накладных'),
(13, 'Вопросы по "Личному кабинету"'),
(14, 'Настройка дефектуры'),
(15, 'Заказ оборудования'),
(16, 'Аренда оборудования'),
(17, 'Автоматизация'),
(18, 'Повторная отправка накладной в СКЛАД 71'),
(19, 'Не доставлена накладная в СКЛАД 71');"""),
('status_ins', """insert into status (uid, name) values (1, 'Заведена'), (2, 'Назначена'), (3, 'В работе'), (4, 'Решено'), (5, 'Не решено');"""),
('customers_ins', """insert into customers (display_name, full_name, address, inn, kpp, phone_num, email, director, contact, create_date, create_user, change_date, active, deleted, id_old) values
('Тестовая аптека №1', 'ООО  Аптека-1 ', 'г. Тула', 710000001, 711000000, '999-999-99-99', 'email@domen.ru', 'Петров И.И.', 'Васин В.В.', current_date, 1, current_date, true, false, '11'),
('Тестовая аптека, находящаяся в другом городе №10', 'ООО  Аптека-2 ', 'г. Тула', 710000002, 711000000, '999-999-99-99', 'email@domen.ru', 'Петров И.И.', 'Васин В.В.', current_date, 1, current_date, true, false, '11'),
('Новая аптека из района', 'ООО  Аптека-3 ', 'г. Тула', 710000003, 711000000, '999-999-99-99', 'email@domen.ru', 'Петров И.И.', 'Васин В.В.', current_date, 1, current_date, true, false, '11'),
('Пока еще не закрытая Тестовая аптека', 'ООО  Аптека-4 ', 'г. Тула', 710000004, 711000000, '999-999-99-99', 'email@domen.ru', 'Петров И.И.', 'Васин В.В.', current_date, 1, current_date, true, false, '11'),
('Аптека №5', 'ООО  Аптека-5 ', 'г. Тула', 710000005, 711000000, '999-999-99-99', 'email@domen.ru', 'Петров И.И.', 'Васин В.В.', current_date, 1, current_date, true, false, '11'),
('Какая-то еще тестовая аптека', 'ООО  Аптека-6 ', 'г. Тула', 710000006, 711000000, '999-999-99-99', 'email@domen.ru', 'Петров И.И.', 'Васин В.В.', current_date, 1, current_date, true, false, '11'),
('Еще онда какая-то аптека', 'ООО  Аптека-7 ', 'г. Тула', 710000007, 711000000, '999-999-99-99', 'email@domen.ru', 'Петров И.И.', 'Васин В.В.', current_date, 1, current_date, true, false, '11'),
('Вообще не понятная аптека', 'ООО  Аптека-8 ', 'г. Тула', 710000008, 711000000, '999-999-99-99', 'email@domen.ru', 'Петров И.И.', 'Васин В.В.', current_date, 1, current_date, true, false, '11');"""),
('points_ins', """insert into points (display_name, customer_id, address, phone_num, email, contact, create_date, create_user, change_date, active, deleted, id_old, comments) values
('Точка номер 1', 1, 'г. Тула', '999-999-99-99', 'email@domain.ru', 'Кукушкин А.А.', current_date, 1, current_date, true, false, '1123', 'комментарий'),
('Точка номер 2', 2, 'г. Тула', '999-999-99-99', 'email@domain.ru', 'Кукушкин А.А.', current_date, 1, current_date, true, false, '1123', 'комментарий'),
('Точка номер 3', 3, 'г. Тула', '999-999-99-99', 'email@domain.ru', 'Кукушкин А.А.', current_date, 1, current_date, true, false, '1123', 'комментарий'),
('Точка номер 4', 4, 'г. Тула', '999-999-99-99', 'email@domain.ru', 'Кукушкин А.А.', current_date, 1, current_date, true, false, '1123', 'комментарий'),
('Точка номер 5', 5, 'г. Тула', '999-999-99-99', 'email@domain.ru', 'Кукушкин А.А.', current_date, 1, current_date, true, false, '1123', 'комментарий'),
('Точка номер 6', 6, 'г. Тула', '999-999-99-99', 'email@domain.ru', 'Кукушкин А.А.', current_date, 1, current_date, true, false, '1123', 'комментарий'),
('Точка номер 7', 7, 'г. Тула', '999-999-99-99', 'email@domain.ru', 'Кукушкин А.А.', current_date, 1, current_date, true, false, '1123', 'комментарий'),
('Точка номер 8', 8, 'г. Тула', '999-999-99-99', 'email@domain.ru', 'Кукушкин А.А.', current_date, 1, current_date, true, false, '1123', 'комментарий'),
('Точка номер 9', 1, 'г. Тула', '999-999-99-99', 'email@domain.ru', 'Кукушкин А.А.', current_date, 1, current_date, true, false, '1123', 'комментарий'),
('Точка номер A', 2, 'г. Тула', '999-999-99-99', 'email@domain.ru', 'Кукушкин А.А.', current_date, 1, current_date, true, false, '1123', 'комментарий'),
('Точка номер B', 1, 'г. Тула', '999-999-99-99', 'email@domain.ru', 'Кукушкин А.А.', current_date, 1, current_date, true, false, '1123', 'комментарий'),
('Точка номер C', 2, 'г. Тула', '999-999-99-99', 'email@domain.ru', 'Кукушкин А.А.', current_date, 1, current_date, true, false, '1123', 'комментарий'),
('Точка номер D', 1, 'г. Тула', '999-999-99-99', 'email@domain.ru', 'Кукушкин А.А.', current_date, 1, current_date, true, false, '1123', 'комментарий'),
('Точка номер E', 1, 'г. Тула', '999-999-99-99', 'email@domain.ru', 'Кукушкин А.А.', current_date, 1, current_date, true, false, '1123', 'комментарий'),
('Точка номер F', 1, 'г. Тула', '999-999-99-99', 'email@domain.ru', 'Кукушкин А.А.', current_date, 1, current_date, true, false, '1123', 'комментарий');"""),
('users_ins', """insert into users (display_name, last_name, first_name, admin, active, deleted, phone_number, int_number, skype_name, email, customer) values
('Тарасов', 'Тарасов', 'Максим', true, true, false, '111', '111', 'qqq', 'email@domen.ru', false),
('Краснов', 'Краснов', 'Евгений', true, true, false, '111', '111', 'qqq', 'email@domen.ru', false),
('Кашинцев', 'Кашинцев', 'Дмитрий', false, true, false, '111', '111', 'qqq', 'email@domen.ru', false),
('Морозов', 'Морозов', 'Дмитрий', false, true, false, '111', '111', 'qqq', 'email@domen.ru', false),
('Овсянников', 'Овсянников', 'Сергей', false, true, false, '111', '111', 'qqq', 'email@domen.ru', false);"""),
('u_ins', """insert into users (uid, display_name, last_name, first_name, admin, active, deleted, phone_number, int_number, skype_name, email, customer) values
(0, '', '', '', false, false, false, '', '', '', '', false);""")
])


class API:
    """
    API class for http access to reloader
    """

    def __init__(self):
        self.exec = sys.executable
        self.user = 'ms71'
        self.password = 'iKoosaishohvekohqua1zociGhiSei6w'
        self.dbname = 'crm'
        self.host = '88.99.236.188'
        self.port = '30000'
        params = {'dbname': self.dbname, 'user': self.user, 'password': self.password, 'host': self.host, 'port': self.port}
        self.con = psycopg2.connect(**params)

    def exe(self, sql):
        cur = self.con.cursor()
        print(cur)
        cur.execute(sql.encode())
        self.con.commit()
        #for i in cur:
            #print(i)
        cur.close()


def main():
    psql = API()
    for i in sql_cre:
        pass
        #psql.exe(sql_cre[i])
    for i in sql_ins:
        pass
        #psql.exe(sql_ins[i])
    sql = sql_ins['points_ins']
    print(sql)
    psql.exe(sql)
    #sql_1 = 'select uid, name from alerts'
    #psql.exe(sql_1)



if "__main__" == __name__:
    main()
