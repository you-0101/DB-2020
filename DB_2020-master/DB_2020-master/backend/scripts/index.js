const express = require('express');
const functions = require('./Functions.js');
const app = express();


async function foo(){
  //res = await user_authorize('euidong1', '1234');
  res = await functions.user_sign_up('euidong9', '1234', '이의동', '01029876311', '1996-07-02', 'EVALUATOR');

  //res = await user_apply_task('euidong1', 'CARD LOG 수집');
  //res = await functions.user_participate_task('euidong1', 'CARD LOG 수집');
  //task_info = {'name': 'COMPUTER DATA 수집', 'description': '컴퓨터 로그를 수집한다.', 'start_period': '2020-05-01', 'end_period': '2020-07-01',
  //              'min_submit_period': '3', 'standard_of_pass': '0'};
  //task_schema = 'CREATE TABLE COMPUTER_DATA(computer varchar(10) not null, period date not null, company text);';
  //task_schema = {'name': 'LOL_LOG', 'fields': [{'name': 'card_name', 'type': 'text'}, {'name': 'score', 'type': 'integer'}]}
  //res = await parse_and_create_new_task(task_info, task_schema, true);
  console.log(res);
}

foo();

