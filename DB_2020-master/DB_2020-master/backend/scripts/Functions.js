// Functions.js
// DB를 사용하는 function들을 정의    

const DBConn = require('./DBConnection.js');
const stats = require('./Stats.js');

// 1. parse_and_create_new_task: 
//    역할: 관리자가 정의한 태스크 정보를 DB의 TASK 테이블에 저장하고, 태스크 데이터 테이블을 생성함
//    파라미터:
//      task_info: 태스크 정보를 담고 있는 json 딕셔너리
//                 name: 태스크 이름
//                 description: 태스크 설명
//                 start_period: 태스크 시작일
//                 end_period: 태스크 종료일
//                 min_submit_period: 최소업로드 주기
//                 standard_of_pass: 평가점수 통과 기준
//
//      task_schema: 태스크 스키마 정보를 담고 있는 json 딕셔너리, 또는 테이블 정의 sql문
//                   name: 태스크 데이터 테이블 이름
//                   fields: 속성 정보를 담고 있는 json 딕셔너리
//                           name: 속성 이름
//                           type: 속성 타입. 
//                                 text, discrete, integer, big integer, float, date, time, datetime 중 하나
//      
//      use_sql: true 일시 테이블 정의 sql문 사용, false 일시 json 딕셔너리 사용
//
//    리턴: 실패/성공 여부 메시지
async function parse_and_create_new_task(task_info, task_schema, use_sql){
    task_name = task_info['name'];
    table_name = task_schema['name'];
  
    query = 'select name from task where name = \''+task_name+'\'';
    results = await DBConn.MakeQuery(query);
    if(results == -1) return stats.ERROR_DB_CONNECTION_FAIL;
    if(results[0] != null) return stats.ERROR_TASK_NAME_DUPLICATE;
  
    query = 'select * from information_schema.tables where table_name = \''+table_name+'\'';
    results = await DBConn.MakeQuery(query);
    if(results == -1) return stats.ERROR_DB_CONNECTION_FAIL;
    if(results[0] != null) return stats.ERROR_TASK_DATA_TABLE_NAME_DUPLICATE;
  
    if(use_sql){
      results = DBConn.MakeQuery(task_schema);
      if(results == -1) return stats.ERROR_DB_CONNECTION_FAIL;
    } else {
      fields = task_schema['fields'];
      query = 'create table '+table_name+'(';
      query += 'task_data_id varchar(10) not null unique primary key,';
      for(f = 0; f < fields.length; f ++){
        query += fields[f]['name'] + ' ';
        
        if(fields[f]['type'] == 'text') {
          query += 'text';
        }
  
        if(fields[f]['type'] == 'discrete') {
          query += 'enum(';
          num_elements = fields['elements'].length;
          for(e = 0; e < num_elements; e++){
            query += ('\''+fields['elements'][e]+'\'');
            if(e != num_elements - 1) query += ',';
          }
          query += ')';
        }
  
        if(fields[f]['type'] == 'integer') {
          query += 'int';
        }
  
        if(fields[f]['type'] == 'big_integer') {
          query += 'bigint';
        }
  
        if(fields[f]['type'] == 'float') {
          query += 'float';
        }
  
        if(fields[f]['type'] == 'date') {
          query += 'date';
        }
  
        if(fields[f]['type'] == 'time') {
          query += 'time';
        }
  
        if(fields[f]['type'] == 'datetime'){
          query += 'datetime';
        }
  
        if(f != fields.length - 1) query += ',';
      }
      query += ');'
  
      results = await DBConn.MakeQuery(query);
      if(results == -1) return stats.ERROR_DB_CONNECTION_FAIL;
    }
  
    task_name = task_info['name'];
    description = task_info['description'];
    start_period = task_info['start_period'];
    end_period = task_info['end_period'];
    min_submit_period = task_info['min_submit_period'];
    standard_of_pass = task_info['standard_of_pass'];
    data_table_name = table_name;
  
    query = 'insert into task values(\''+task_name+'\', \''+description+'\', \''+start_period+'\', \''
              +end_period+'\','+min_submit_period+', '+standard_of_pass+', \''+data_table_name+'\')';
    results = DBConn.MakeQuery(query);
    if(results == -1) return stats.ERROR_DB_CONNECTION_FAIL;
  
    return stats.SUCCESS;
}
  
// 2. user_apply_task:
//    역할: 제출자 태스크 신청 정보를 DB의 APPLY 테이블에 저장함
//    파라미터:
//      user_id: 신청자 id
//      task_name: 태스크 이름
//
//    리턴: 실패/성공 여부 메시지
async function user_apply_task(user_id, task_name){
    query = 'select * from apply where applicant_id = \''+user_id+'\' AND task_name = \''+task_name+'\'';
    results = await DBConn.MakeQuery(query);
    if(results == -1) return stats.ERROR_DB_CONNECTION_FAIL;
    if(results[0] != null) return stats.ERROR_ALREADY_APPLIED;
  
    query = 'insert into apply values(\''+user_id+'\', \''+task_name+'\')';
    results = await DBConn.MakeQuery(query);
    if(results == -1) return stats.ERROR_DB_CONNECTION_FAIL;
  
    return stats.SUCCESS;
}
  
// 3. user_participate_task:
//    역할: 제출자 태스크 참여 정보를 DB의 PARTICIPATE 테이블에 저장함
//    파라미터:
//      user_id: 참여자 id
//      task_name: 태스크 이름
//
//    리턴: 실패/성공 여부 메시지
async function user_participate_task(user_id, task_name){
    query = 'select * from participate where participant_id = \''+user_id+'\' AND task_name = \''+task_name+'\'';
    results = await DBConn.MakeQuery(query);
    if(results == -1) return stats.ERROR_DB_CONNECTION_FAIL;
    if(results[0] != null) return stats.ERROR_ALREADY_PARTICIPATING;
  
    query = 'insert into participate values(\''+user_id+'\', \''+task_name+'\')';
    results = await DBConn.MakeQuery(query);
    if(results == -1) return stats.ERROR_DB_CONNECTION_FAIL;
  
    return stats.SUCCESS;
}
 
// 4. user_sign_up:
//    역할: 유저 회원가입 정보를 DB의 USER 테이블에 저장함
//    파라미터: 유저 정보들
//    리턴: 실패/성공 여부 메시지
async function user_sign_up(id, password, name, phone_number, birthday, type){
    query = 'select * from user where id = \''+id+'\'';
    results = await DBConn.MakeQuery(query);
    if(results == -1) return stats.ERROR_DB_CONNECTION_FAIL;
    if(results[0] != null) return stats.ERROR_ID_DUPLICATE;
  
    query = 'insert into user(id, password, name, phone_number, birthday, type) values(\''+id+'\', \''+password+'\', \''+name+'\', \''+phone_number+'\', \''+birthday+'\', \''+type+'\')';
    results = await DBConn.MakeQuery(query);
    if(results == -1) return stats.ERROR_DB_CONNECTION_FAIL;
  
    return stats.SUCCESS;
}
  
// 5. user_authorize:
//    역할: 유저 로그인 정보를 DB의 USER 테이블과 비교하고 실패/성공 여부를 반환함
//    파라미터: 유저 아이디, 패스워드
//    리턴: 로그인 실패/성공 여부 메시지
async function user_authorize(id, password){
    query = 'select password from user where id=\''+id+'\'';
    results = await DBConn.MakeQuery(query);
    if(results == -1) return stats.ERROR_DB_CONNECTION_FAIL;
    if(results[0] == null) return stats.ERROR_NO_ID;
    if(results[0]['password'] != password) return stats.ERROR_WRONG_PASSWORD;
    return stats.SUCCESS;
}

module.exports = {
    parse_and_create_new_task: parse_and_create_new_task,
    user_apply_task: user_apply_task,
    user_participate_task: user_participate_task,
    user_sign_up: user_sign_up,
    user_authorize: user_authorize
}