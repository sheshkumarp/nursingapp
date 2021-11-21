-- admin_users table
create table admin_users(
    id serial primary key,
    firstname varchar(255),
    lastname varchar(255),
    email varchar(255) unique not null,
    password varchar(255) not null,
    reset_token varchar(255) default null,
    reset_token_expiry timestamp default null,
    created_at date default current_date
)
