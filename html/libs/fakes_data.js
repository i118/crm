"use strict";

var data_1 = [
{alert: 2, num: 1, create_date: "06.05.2012", to_work_date: "07.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 3, theame: "Не накладные", ordered: "Кашинцев"},
{alert: 1, num: 2, create_date: "07.05.2012", to_work_date: "07.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 3, theame: "пришли накладные", ordered: "Кашинцев"},
{alert: 2, num: 3, create_date: "08.05.2012", to_work_date: "08.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс минусПлюс", in_work: 1, theame: "Не пришли ", ordered: "Кашинцев"},
{alert: 2, num: 4, create_date: "09.05.2012", to_work_date: "08.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 3, theame: "Не накладные", ordered: "Кашинцев"},
{alert: 2, num: 5, create_date: "10.05.2012", to_work_date: "12.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс минусПлюс", in_work: 4, theame: "Не пришли накладные", ordered: "Кашинцев"},
{alert: 2, num: 6, create_date: "11.05.2012", to_work_date: "12.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 3, theame: "Не накладные", ordered: "Кашинцев"},
{alert: 2, num: 8, create_date: "12.05.2012", to_work_date: "14.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс минусПлюс", in_work: 6, theame: "Не пришли", ordered: "Кашинцев"},
{alert: 2, num: 9, create_date: "12.05.2012", to_work_date: "14.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 3, theame: "Не пришли накладные", ordered: "Кашинцев"},
{alert: 2, num: 10, create_date: "13.05.2012", to_work_date: "14.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 4, theame: "Не пришли", ordered: "Тарасов"},
{alert: 2, num: 11, create_date: "15.05.2012", to_work_date: "15.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс минус", in_work: 2, theame: "Не пришли накладные", ordered: "Тарасов"},
{alert: 1, num: 12, create_date: "10.05.2012", to_work_date: "11.05.2012", status: "В работе", create_user: "Тарасов", client: "Партнер-Инвест ООО Московская Область, г. Серпухов, Мишина проезд, 7", in_work: 3, theame: "Не пришли накладные", ordered: "Кашинцев"},
{alert: 2, num: 13, create_date: "05.05.2012", to_work_date: "07.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс минус", in_work: 3, theame: "Не пришли накладные", ordered: "Тарасов"},
{alert: 0, num: 14, create_date: "05.05.2012", to_work_date: "07.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 3, theame: "Не пришли накладные", ordered: "Кашинцев"},
{alert: 1, num: 15, create_date: "05.05.2012", to_work_date: "07.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс минус", in_work: 3, theame: "Не пришли накладные", ordered: "Кашинцев"},
{alert: 2, num: 1650, create_date: "05.05.2012", to_work_date: "07.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 3, theame: "Не пришли накладные", ordered: "Кашинцев"},
{alert: 2, num: 10650, create_date: "05.05.2012", to_work_date: "07.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 3, theame: "Не пришли накладные", ordered: "Кашинцев"}
];

var data_2 = [
{alert: 2, num: 1, create_date: "06.05.2012", to_work_date: "07.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 3, theame: "Не накладные", ordered: "Кашинцев"},
{alert: 1, num: 2, create_date: "07.05.2012", to_work_date: "07.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 3, theame: "пришли накладные", ordered: "Кашинцев"},
{alert: 2, num: 3, create_date: "08.05.2012", to_work_date: "08.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс минусПлюс", in_work: 1, theame: "Не пришли ", ordered: "Кашинцев"},
{alert: 2, num: 4, create_date: "09.05.2012", to_work_date: "08.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 3, theame: "Не накладные", ordered: "Кашинцев"},
{alert: 2, num: 5, create_date: "10.05.2012", to_work_date: "12.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс минусПлюс", in_work: 4, theame: "Не пришли накладные", ordered: "Кашинцев"},
{alert: 2, num: 6, create_date: "11.05.2012", to_work_date: "12.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 3, theame: "Не накладные", ordered: "Кашинцев"},
{alert: 2, num: 8, create_date: "12.05.2012", to_work_date: "14.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс минусПлюс", in_work: 6, theame: "Не пришли", ordered: "Кашинцев"},
{alert: 2, num: 9, create_date: "12.05.2012", to_work_date: "14.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 3, theame: "Не пришли накладные", ordered: "Кашинцев"},
{alert: 2, num: 10, create_date: "13.05.2012", to_work_date: "14.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 4, theame: "Не пришли", ordered: "Тарасов"},
{alert: 2, num: 11, create_date: "15.05.2012", to_work_date: "15.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс минус", in_work: 2, theame: "Не пришли накладные", ordered: "Тарасов"},
{alert: 1, num: 12, create_date: "10.05.2012", to_work_date: "11.05.2012", status: "В работе", create_user: "Тарасов", client: "Партнер-Инвест ООО Московская Область, г. Серпухов, Мишина проезд, 7", in_work: 3, theame: "Не пришли накладные", ordered: "Кашинцев"},
{alert: 2, num: 13, create_date: "05.05.2012", to_work_date: "07.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс минус", in_work: 3, theame: "Не пришли накладные", ordered: "Тарасов"},
{alert: 0, num: 14, create_date: "05.05.2012", to_work_date: "07.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 3, theame: "Не пришли накладные", ordered: "Кашинцев"},
{alert: 1, num: 15, create_date: "05.05.2012", to_work_date: "07.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс минус", in_work: 3, theame: "Не пришли накладные", ordered: "Кашинцев"},
{alert: 2, num: 1650, create_date: "05.05.2012", to_work_date: "07.05.2012", status: "В работе", create_user: "Тарасов", client: "Парацельс Плюс", in_work: 3, theame: "Не пришли накладные", ordered: "Кашинцев"}
]
