create table admin_users(
    id serial primary key,
    role_id integer default 0,
    firstname varchar(255),
    lastname varchar(255),
    email varchar(255) unique not null,
    password varchar(255) not null,
    reset_token varchar(255) default null,
    reset_token_expiry timestamp default null,
    status integer default 0,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default null
);

create table service_type_master(
    id serial primary key,
    name varchar(255),
    status integer default 0,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default null
)


create table service_type_level_one(
    id serial primary key,
    service_type_id integer not null,
    name varchar(255), 
    addional_commission numeric(10,2),
    status integer default 0,
    created_at date default current_date,
    updated_at date default null
)

create table service_type_level_two(
    id serial primary key,
    service_level_one_id integer not null,
    name varchar(255),
    addional_commission numeric(10,2),
    status integer default 0,
    created_at date default current_date,
    updated_at date default null
)





create table admin_roles(
    id serial primary key,
    name varchar(255),
    slug varchar(255),
    status integer default 0,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default null
)

create table admin_permissions (
    id serial primary key,
    name varchar(255),
    slug varchar(255),
    status integer default 0,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default null
) 

create table admin_role_permissions (
    id serial primary key,
    role_id integer not null,
    permission_id integer not null,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default null
) 

create table equipment_master(
    id serial primary key,
    name varchar(255),
    equipment_type varchar(255) default null,
    image varchar(255) default null,
    description varchar(255) default null, 
    price numeric(10,2) default null,
    status integer default 0,
    created_at date default current_date,
    updated_at date default null
)

create table mail_alert(
    id serial primary key,
    name varchar(255),
    description varchar(255) default null,
    status integer default 0,
    created_at date default current_date,
    updated_at date default null
)

create table advertise_master(
    id serial primary key,
    name varchar(255),
    image varchar(255) default null,
    description varchar(255) default null,
    position varchar(255) default null,
    status integer default 0,
    created_at date default current_date,
    updated_at date default null
)