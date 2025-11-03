create table user_roles
(
    user_id bigint not null,
    role_id int    not null
);

ALTER TABLE user_roles
    ADD CONSTRAINT user_roles_roles_id_fk FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE NO ACTION;

ALTER TABLE user_roles
    ADD CONSTRAINT user_roles_users_id_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE NO ACTION;




