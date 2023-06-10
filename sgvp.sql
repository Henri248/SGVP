PGDMP     9            
        {            SGVP    15.3    15.0 /    .           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            /           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            0           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            1           1262    16442    SGVP    DATABASE     }   CREATE DATABASE "SGVP" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Portuguese_Brazil.1252';
    DROP DATABASE "SGVP";
                postgres    false            �            1259    17223    clientes    TABLE     �   CREATE TABLE public.clientes (
    id integer NOT NULL,
    nome character varying(50),
    email character varying(50),
    telefone character varying(20),
    endereco character varying(200)
);
    DROP TABLE public.clientes;
       public         heap    postgres    false            �            1259    17222    clientes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.clientes_id_seq;
       public          postgres    false    220            2           0    0    clientes_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;
          public          postgres    false    219            �            1259    17199    produtos    TABLE     �   CREATE TABLE public.produtos (
    id integer NOT NULL,
    nome character varying(50),
    categoria character varying(30),
    preco numeric(10,2),
    estoque integer,
    descricao character varying(200),
    ativo boolean
);
    DROP TABLE public.produtos;
       public         heap    postgres    false            �            1259    17198    produtos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.produtos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.produtos_id_seq;
       public          postgres    false    215            3           0    0    produtos_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.produtos_id_seq OWNED BY public.produtos.id;
          public          postgres    false    214            �            1259    17247    produtos_vendas    TABLE     �   CREATE TABLE public.produtos_vendas (
    id integer NOT NULL,
    id_venda integer,
    id_produto integer,
    quantidade integer
);
 #   DROP TABLE public.produtos_vendas;
       public         heap    postgres    false            �            1259    17246    produtos_vendas_id_seq    SEQUENCE     �   CREATE SEQUENCE public.produtos_vendas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.produtos_vendas_id_seq;
       public          postgres    false    224            4           0    0    produtos_vendas_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.produtos_vendas_id_seq OWNED BY public.produtos_vendas.id;
          public          postgres    false    223            �            1259    17205    usuarios    TABLE     �   CREATE TABLE public.usuarios (
    email character varying(50) NOT NULL,
    senha character varying(50),
    gestor boolean
);
    DROP TABLE public.usuarios;
       public         heap    postgres    false            �            1259    17230    vendas    TABLE     x   CREATE TABLE public.vendas (
    id integer NOT NULL,
    id_vendedor integer,
    id_cliente integer,
    data date
);
    DROP TABLE public.vendas;
       public         heap    postgres    false            �            1259    17229    vendas_id_seq    SEQUENCE     �   CREATE SEQUENCE public.vendas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.vendas_id_seq;
       public          postgres    false    222            5           0    0    vendas_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.vendas_id_seq OWNED BY public.vendas.id;
          public          postgres    false    221            �            1259    17211 
   vendedores    TABLE       CREATE TABLE public.vendedores (
    id integer NOT NULL,
    nome character varying(50),
    email character varying(50),
    telefone character varying(20),
    endereco character varying(200),
    meta numeric(10,2),
    meta_atual numeric(10,2),
    ativo boolean
);
    DROP TABLE public.vendedores;
       public         heap    postgres    false            �            1259    17210    vendedores_id_seq    SEQUENCE     �   CREATE SEQUENCE public.vendedores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.vendedores_id_seq;
       public          postgres    false    218            6           0    0    vendedores_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.vendedores_id_seq OWNED BY public.vendedores.id;
          public          postgres    false    217                       2604    17226    clientes id    DEFAULT     j   ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);
 :   ALTER TABLE public.clientes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            }           2604    17202    produtos id    DEFAULT     j   ALTER TABLE ONLY public.produtos ALTER COLUMN id SET DEFAULT nextval('public.produtos_id_seq'::regclass);
 :   ALTER TABLE public.produtos ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    214    215    215            �           2604    17250    produtos_vendas id    DEFAULT     x   ALTER TABLE ONLY public.produtos_vendas ALTER COLUMN id SET DEFAULT nextval('public.produtos_vendas_id_seq'::regclass);
 A   ALTER TABLE public.produtos_vendas ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    223    224            �           2604    17233 	   vendas id    DEFAULT     f   ALTER TABLE ONLY public.vendas ALTER COLUMN id SET DEFAULT nextval('public.vendas_id_seq'::regclass);
 8   ALTER TABLE public.vendas ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221    222            ~           2604    17214    vendedores id    DEFAULT     n   ALTER TABLE ONLY public.vendedores ALTER COLUMN id SET DEFAULT nextval('public.vendedores_id_seq'::regclass);
 <   ALTER TABLE public.vendedores ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    218    218            '          0    17223    clientes 
   TABLE DATA           G   COPY public.clientes (id, nome, email, telefone, endereco) FROM stdin;
    public          postgres    false    220   �4       "          0    17199    produtos 
   TABLE DATA           Y   COPY public.produtos (id, nome, categoria, preco, estoque, descricao, ativo) FROM stdin;
    public          postgres    false    215   �5       +          0    17247    produtos_vendas 
   TABLE DATA           O   COPY public.produtos_vendas (id, id_venda, id_produto, quantidade) FROM stdin;
    public          postgres    false    224   m6       #          0    17205    usuarios 
   TABLE DATA           8   COPY public.usuarios (email, senha, gestor) FROM stdin;
    public          postgres    false    216   �6       )          0    17230    vendas 
   TABLE DATA           C   COPY public.vendas (id, id_vendedor, id_cliente, data) FROM stdin;
    public          postgres    false    222   07       %          0    17211 
   vendedores 
   TABLE DATA           b   COPY public.vendedores (id, nome, email, telefone, endereco, meta, meta_atual, ativo) FROM stdin;
    public          postgres    false    218   �7       7           0    0    clientes_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.clientes_id_seq', 10, true);
          public          postgres    false    219            8           0    0    produtos_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.produtos_id_seq', 10, true);
          public          postgres    false    214            9           0    0    produtos_vendas_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.produtos_vendas_id_seq', 9, true);
          public          postgres    false    223            :           0    0    vendas_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.vendas_id_seq', 6, true);
          public          postgres    false    221            ;           0    0    vendedores_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.vendedores_id_seq', 9, true);
          public          postgres    false    217            �           2606    17228    clientes clientes_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.clientes DROP CONSTRAINT clientes_pkey;
       public            postgres    false    220            �           2606    17204    produtos produtos_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.produtos DROP CONSTRAINT produtos_pkey;
       public            postgres    false    215            �           2606    17252 $   produtos_vendas produtos_vendas_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.produtos_vendas
    ADD CONSTRAINT produtos_vendas_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.produtos_vendas DROP CONSTRAINT produtos_vendas_pkey;
       public            postgres    false    224            �           2606    17209    usuarios usuarios_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (email);
 @   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
       public            postgres    false    216            �           2606    17235    vendas vendas_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.vendas
    ADD CONSTRAINT vendas_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.vendas DROP CONSTRAINT vendas_pkey;
       public            postgres    false    222            �           2606    17216    vendedores vendedores_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.vendedores
    ADD CONSTRAINT vendedores_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.vendedores DROP CONSTRAINT vendedores_pkey;
       public            postgres    false    218            �           2606    17258 /   produtos_vendas produtos_vendas_id_produto_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.produtos_vendas
    ADD CONSTRAINT produtos_vendas_id_produto_fkey FOREIGN KEY (id_produto) REFERENCES public.produtos(id);
 Y   ALTER TABLE ONLY public.produtos_vendas DROP CONSTRAINT produtos_vendas_id_produto_fkey;
       public          postgres    false    3203    224    215            �           2606    17253 -   produtos_vendas produtos_vendas_id_venda_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.produtos_vendas
    ADD CONSTRAINT produtos_vendas_id_venda_fkey FOREIGN KEY (id_venda) REFERENCES public.vendas(id);
 W   ALTER TABLE ONLY public.produtos_vendas DROP CONSTRAINT produtos_vendas_id_venda_fkey;
       public          postgres    false    222    3211    224            �           2606    17241    vendas vendas_id_cliente_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.vendas
    ADD CONSTRAINT vendas_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.clientes(id);
 G   ALTER TABLE ONLY public.vendas DROP CONSTRAINT vendas_id_cliente_fkey;
       public          postgres    false    220    3209    222            �           2606    17236    vendas vendas_id_vendedor_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.vendas
    ADD CONSTRAINT vendas_id_vendedor_fkey FOREIGN KEY (id_vendedor) REFERENCES public.vendedores(id);
 H   ALTER TABLE ONLY public.vendas DROP CONSTRAINT vendas_id_vendedor_fkey;
       public          postgres    false    218    222    3207            �           2606    17217     vendedores vendedores_email_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.vendedores
    ADD CONSTRAINT vendedores_email_fkey FOREIGN KEY (email) REFERENCES public.usuarios(email);
 J   ALTER TABLE ONLY public.vendedores DROP CONSTRAINT vendedores_email_fkey;
       public          postgres    false    216    3205    218            '   �   x�UѻAE�x]�V���x2$D$h� i?���zƾ��������������uY�K��}|�)��m8m����>z
�X0�q-9���E�hXF�EJ�X2,!�ea,V�b���V�K�b���
VH�J,���~)�Ԅ5�fXA�5���������}ɻ��      "   �   x�u�=� �N�	��[j<��ɘ�X1�,<H.�b�m��xow q���Y����,�kP'F猧��}�_�o�5�__�%l�, W�Yk�vd�&�Wj���#��Ic&��'���VG/k=�@64���`m@��6�Ձ3k#�D65�nk�sB���s���,��!��ô�a���a0�����Iç      +   =   x����0�0L$�q�����ȹB�d��@ӳ]��\�n\�?ߐ�톯��>\��oؾb�	+      #   f   x�e�;�  Й����y#U#�x|j���0�R#�s<�K��`�g%Vh_kޚ��mH[ޖ���H{ޞtǻ#���I���7,5_�S�X'*L 6�k�      )   C   x�E̻�@���	�'�.��p�򳌋��j��Pb��9�\H���Phy�/p>�=���      %   �   x�Uѽ1�ڙ�	N���Ѱ�BB���'��k)�'�a_os����ն�����~��i���!�\`�?����w�Z;Y�<�D"� ��b�����HL9��Pn���P
3S^)/�(��(/���JA�0H��IA�A�**��c霎�@��w>MR*	��8��5����T*��騬�*J��@ENG�u�F����0c~z��     