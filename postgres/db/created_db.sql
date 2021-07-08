create table public.member (
  id character varying(20) not null
  , pw character varying(100) not null
  , name character varying(20) not null
  , email character varying(100) not null
  , postcode integer not null
  , "roadAddress" character varying(100) not null
  , "jibunAddress" character varying(100) not null
  , "detailAddress" character varying(100) not null
  , primary key (id)
);

create table public.seller (
  id character varying(20) not null
  , pw character varying(100) not null
  , name character varying(20) not null
  , email character varying(100) not null
  , postcode integer not null
  , "roadAddress" character varying(100) not null
  , "jibunAddress" character varying(100) not null
  , "detailAddress" character varying(100) not null
  , primary key (id)
);

create table public.rider (
  id character varying(20) not null
  , pw character varying(100) not null
  , name character varying(20) not null
  , email character varying(100) not null
  , postcode integer not null
  , "roadAddress" character varying(100) not null
  , "jibunAddress" character varying(100) not null
  , "detailAddress" character varying(100) not null
  , primary key (id)
);

create sequence recipe_id_seq;
create table public.recipe (
  recipeid integer not null default nextval('recipe_id_seq')
  , recipename character varying(1000) not null
  , recipesummary character varying(1000)
  , price character varying(20) not null
  , modify bigint not null
  , recipelove bigint not null
  , recipehate bigint not null
  , food_name character varying(100) not null
  , seller_id character varying(20) not null
  , delivary_flag boolean not null
  , takeout_flag boolean not null
  , primary key (recipeid)
);
alter sequence recipe_id_seq owned by recipe.recipeid;

create sequence recipedetail_id_seq;
create table public.recipedetail (
  id integer not null default nextval('recipedetail_id_seq')
  , recipedetailnum bigint not null
  , recipedetailtext text not null
  , recipedetailtip text
  , recipedetailimage bytea
  , recipe_id integer not null
  , primary key (id)
);
alter sequence recipedetail_id_seq owned by recipedetail.id;

create table public.order_info (
  id_uid character varying(200) not null
  , product_uid character varying(200) not null
  , member_id character varying(200) not null
  , pay character varying(20) not null
  , order_money integer not null
  , order_password character varying(200) not null
  , order_email character varying(100) not null
  , order_phone character varying(100) not null
  , order_postcode integer not null
  , "order_roadAddress" character varying(100) not null
  , "order_detailAddress" character varying(100) not null
  , available_flag boolean not null
  , primary key (id_uid)
);

create sequence order_detail_num_seq;
create table public.order_detail (
  num integer not null default nextval('order_detail_num_seq')
  , id_uid character varying(200) not null
  , product_uid character varying(200) not null
  , member_id character varying(200) not null
  , recipe_id integer not null
  , count bigint not null
  , price character varying(20) not null
  , ordertime date not null
  , updatetime date
  , primary key (num)
);
alter sequence order_detail_num_seq owned by order_detail.num;

create table public.food (
  foodname character varying(100) not null
  , foodgroup character varying(200) not null
  , fooddetail character varying(200) not null
  , primary key (foodname)
);

create sequence delivary_id_seq;
create table public.delivary (
  id integer not null default nextval('delivary_id_seq')
  , status character varying(50) not null
  , rider_id character varying(20) not null
  , id_uid character varying(200) not null
  , primary key (id)
);
alter sequence delivary_id_seq owned by delivary.id;

insert into seller 
values ('seller1', '$2b$12$Py1s9zD89qGMrdm8qucSke93uSCtJk5YtfQPn5hPM/CywcmLTdKhu', 'seller1', 'seller1@google.com', 6307, '서울 강남구 개포로 202 (개포동)', '서울 강남구 개포동 1238', '101동 101호');

insert into order_info
values ('id_uid1', 'product_uid1', 'member1', 'card', 10000, 1234, 'memeber1@google.com', '010-1234-5678', 12345, 'order_roadAddress', 'order_detailAddress', true);

insert into order_detail
values (1, 'id_uid1', 'product_uid1', 'member1', 1, 1, 3000, '2021-07-01', null);