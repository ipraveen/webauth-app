create table roles
(
    id   int auto_increment,
    name varchar(50) not null,
    CONSTRAINT `PRIMARY` PRIMARY KEY (id)
);

create unique index roles_name_unique
    on roles (name);

INSERT INTO roles (name)
VALUES ('ADMIN'),
       ('USER'),
       ('MANAGER');


