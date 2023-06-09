PGDMP                         {            sgvp    15.3    15.3 ;    B           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            C           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            D           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            E           1262    16398    sgvp    DATABASE     {   CREATE DATABASE sgvp WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Portuguese_Brazil.1252';
    DROP DATABASE sgvp;
                postgres    false            �            1255    17795    aumentar_meta_vendedor()    FUNCTION     B  CREATE FUNCTION public.aumentar_meta_vendedor() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    preco_produto decimal(10,2);
	valor_total_produto decimal(10,2);
BEGIN
    SELECT preco INTO preco_produto FROM produtos WHERE id = NEW.id_produto;

    valor_total_produto := preco_produto * NEW.quantidade;

	UPDATE produtos
	SET estoque = estoque - NEW.quantidade
	WHERE id = NEW.id_produto;
	
    UPDATE vendedores
    SET meta_atual = meta_atual + valor_total_produto
    WHERE id = (SELECT id_vendedor FROM vendas WHERE id = NEW.id_venda);

    RETURN NEW;
END;
$$;
 /   DROP FUNCTION public.aumentar_meta_vendedor();
       public          postgres    false            �            1255    17801    criar_usuario()    FUNCTION     �   CREATE FUNCTION public.criar_usuario() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	INSERT INTO usuarios (email, senha, gestor) VALUES(NEW.email, '123', false);
	RETURN NEW;
END;
$$;
 &   DROP FUNCTION public.criar_usuario();
       public          postgres    false            �            1255    17797    diminuir_meta_vendedor()    FUNCTION     Y  CREATE FUNCTION public.diminuir_meta_vendedor() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	row RECORD;
    preco_produto decimal(10,2);
	valor_total decimal(10,2) := 0;
BEGIN
	FOR row IN SELECT * FROM produtos_vendas WHERE id_venda = OLD.id LOOP
	
    SELECT preco INTO preco_produto FROM produtos WHERE id = row.id_produto;

    valor_total := valor_total + (preco_produto * row.quantidade);
	
	END LOOP;
	
	DELETE FROM produtos_vendas WHERE id_venda = OLD.id;
	
	UPDATE vendedores
    SET meta_atual = meta_atual - valor_total
    WHERE id = OLD.id_vendedor;
	
    RETURN OLD;
END;
$$;
 /   DROP FUNCTION public.diminuir_meta_vendedor();
       public          postgres    false            �            1255    17799    excluir_usuario()    FUNCTION     �   CREATE FUNCTION public.excluir_usuario() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	DELETE FROM usuarios WHERE email = NEW.email;	
	RETURN NEW;
END;
$$;
 (   DROP FUNCTION public.excluir_usuario();
       public          postgres    false            �            1259    17749    clientes    TABLE     �   CREATE TABLE public.clientes (
    id integer NOT NULL,
    nome character varying(50) NOT NULL,
    email character varying(50),
    telefone character varying(20),
    endereco character varying(200)
);
    DROP TABLE public.clientes;
       public         heap    postgres    false            �            1259    17748    clientes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.clientes_id_seq;
       public          postgres    false    220            F           0    0    clientes_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;
          public          postgres    false    219            �            1259    17718    produtos    TABLE     m  CREATE TABLE public.produtos (
    id integer NOT NULL,
    nome character varying(50) NOT NULL,
    categoria character varying(30),
    preco numeric(10,2) NOT NULL,
    estoque integer NOT NULL,
    descricao character varying(200),
    ativo boolean NOT NULL,
    filename character varying(255),
    CONSTRAINT produtos_estoque_check CHECK ((estoque >= 0))
);
    DROP TABLE public.produtos;
       public         heap    postgres    false            �            1259    17717    produtos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.produtos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.produtos_id_seq;
       public          postgres    false    215            G           0    0    produtos_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.produtos_id_seq OWNED BY public.produtos.id;
          public          postgres    false    214            �            1259    17777    produtos_vendas    TABLE     �   CREATE TABLE public.produtos_vendas (
    id integer NOT NULL,
    id_venda integer NOT NULL,
    id_produto integer NOT NULL,
    quantidade integer NOT NULL,
    CONSTRAINT produtos_vendas_quantidade_check CHECK ((quantidade > 0))
);
 #   DROP TABLE public.produtos_vendas;
       public         heap    postgres    false            �            1259    17776    produtos_vendas_id_seq    SEQUENCE     �   CREATE SEQUENCE public.produtos_vendas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.produtos_vendas_id_seq;
       public          postgres    false    224            H           0    0    produtos_vendas_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.produtos_vendas_id_seq OWNED BY public.produtos_vendas.id;
          public          postgres    false    223            �            1259    17743    usuarios    TABLE     �   CREATE TABLE public.usuarios (
    email character varying(50) NOT NULL,
    senha character varying(50) NOT NULL,
    gestor boolean
);
    DROP TABLE public.usuarios;
       public         heap    postgres    false            �            1259    17760    vendas    TABLE     �   CREATE TABLE public.vendas (
    id integer NOT NULL,
    id_vendedor integer NOT NULL,
    id_cliente integer,
    data timestamp without time zone
);
    DROP TABLE public.vendas;
       public         heap    postgres    false            �            1259    17759    vendas_id_seq    SEQUENCE     �   CREATE SEQUENCE public.vendas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.vendas_id_seq;
       public          postgres    false    222            I           0    0    vendas_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.vendas_id_seq OWNED BY public.vendas.id;
          public          postgres    false    221            �            1259    17730 
   vendedores    TABLE     �  CREATE TABLE public.vendedores (
    id integer NOT NULL,
    nome character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    telefone character varying(20),
    endereco character varying(200),
    meta numeric(10,2) NOT NULL,
    meta_atual numeric(10,2),
    ativo boolean,
    filename character varying(255),
    CONSTRAINT vendedores_meta_check CHECK ((meta >= (0)::numeric))
);
    DROP TABLE public.vendedores;
       public         heap    postgres    false            �            1259    17729    vendedores_id_seq    SEQUENCE     �   CREATE SEQUENCE public.vendedores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.vendedores_id_seq;
       public          postgres    false    217            J           0    0    vendedores_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.vendedores_id_seq OWNED BY public.vendedores.id;
          public          postgres    false    216            �           2604    17752    clientes id    DEFAULT     j   ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);
 :   ALTER TABLE public.clientes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            �           2604    17721    produtos id    DEFAULT     j   ALTER TABLE ONLY public.produtos ALTER COLUMN id SET DEFAULT nextval('public.produtos_id_seq'::regclass);
 :   ALTER TABLE public.produtos ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215            �           2604    17780    produtos_vendas id    DEFAULT     x   ALTER TABLE ONLY public.produtos_vendas ALTER COLUMN id SET DEFAULT nextval('public.produtos_vendas_id_seq'::regclass);
 A   ALTER TABLE public.produtos_vendas ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    223    224            �           2604    17763 	   vendas id    DEFAULT     f   ALTER TABLE ONLY public.vendas ALTER COLUMN id SET DEFAULT nextval('public.vendas_id_seq'::regclass);
 8   ALTER TABLE public.vendas ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    222    222            �           2604    17733    vendedores id    DEFAULT     n   ALTER TABLE ONLY public.vendedores ALTER COLUMN id SET DEFAULT nextval('public.vendedores_id_seq'::regclass);
 <   ALTER TABLE public.vendedores ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217            ;          0    17749    clientes 
   TABLE DATA           G   COPY public.clientes (id, nome, email, telefone, endereco) FROM stdin;
    public          postgres    false    220   �I       6          0    17718    produtos 
   TABLE DATA           c   COPY public.produtos (id, nome, categoria, preco, estoque, descricao, ativo, filename) FROM stdin;
    public          postgres    false    215   EK       ?          0    17777    produtos_vendas 
   TABLE DATA           O   COPY public.produtos_vendas (id, id_venda, id_produto, quantidade) FROM stdin;
    public          postgres    false    224   �M       9          0    17743    usuarios 
   TABLE DATA           8   COPY public.usuarios (email, senha, gestor) FROM stdin;
    public          postgres    false    218   _N       =          0    17760    vendas 
   TABLE DATA           C   COPY public.vendas (id, id_vendedor, id_cliente, data) FROM stdin;
    public          postgres    false    222   �N       8          0    17730 
   vendedores 
   TABLE DATA           l   COPY public.vendedores (id, nome, email, telefone, endereco, meta, meta_atual, ativo, filename) FROM stdin;
    public          postgres    false    217   �O       K           0    0    clientes_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.clientes_id_seq', 10, true);
          public          postgres    false    219            L           0    0    produtos_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.produtos_id_seq', 10, true);
          public          postgres    false    214            M           0    0    produtos_vendas_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.produtos_vendas_id_seq', 30, true);
          public          postgres    false    223            N           0    0    vendas_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.vendas_id_seq', 15, true);
          public          postgres    false    221            O           0    0    vendedores_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.vendedores_id_seq', 10, true);
          public          postgres    false    216            �           2606    17756    clientes clientes_email_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_email_key UNIQUE (email);
 E   ALTER TABLE ONLY public.clientes DROP CONSTRAINT clientes_email_key;
       public            postgres    false    220            �           2606    17754    clientes clientes_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.clientes DROP CONSTRAINT clientes_pkey;
       public            postgres    false    220            �           2606    17758    clientes clientes_telefone_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_telefone_key UNIQUE (telefone);
 H   ALTER TABLE ONLY public.clientes DROP CONSTRAINT clientes_telefone_key;
       public            postgres    false    220            �           2606    17728    produtos produtos_nome_key 
   CONSTRAINT     U   ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_nome_key UNIQUE (nome);
 D   ALTER TABLE ONLY public.produtos DROP CONSTRAINT produtos_nome_key;
       public            postgres    false    215            �           2606    17726    produtos produtos_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.produtos DROP CONSTRAINT produtos_pkey;
       public            postgres    false    215            �           2606    17783 $   produtos_vendas produtos_vendas_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.produtos_vendas
    ADD CONSTRAINT produtos_vendas_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.produtos_vendas DROP CONSTRAINT produtos_vendas_pkey;
       public            postgres    false    224            �           2606    17747    usuarios usuarios_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (email);
 @   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
       public            postgres    false    218            �           2606    17765    vendas vendas_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.vendas
    ADD CONSTRAINT vendas_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.vendas DROP CONSTRAINT vendas_pkey;
       public            postgres    false    222            �           2606    17740    vendedores vendedores_email_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.vendedores
    ADD CONSTRAINT vendedores_email_key UNIQUE (email);
 I   ALTER TABLE ONLY public.vendedores DROP CONSTRAINT vendedores_email_key;
       public            postgres    false    217            �           2606    17738    vendedores vendedores_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.vendedores
    ADD CONSTRAINT vendedores_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.vendedores DROP CONSTRAINT vendedores_pkey;
       public            postgres    false    217            �           2606    17742 "   vendedores vendedores_telefone_key 
   CONSTRAINT     a   ALTER TABLE ONLY public.vendedores
    ADD CONSTRAINT vendedores_telefone_key UNIQUE (telefone);
 L   ALTER TABLE ONLY public.vendedores DROP CONSTRAINT vendedores_telefone_key;
       public            postgres    false    217            �           2620    17796 &   produtos_vendas aumentar_meta_vendedor    TRIGGER     �   CREATE TRIGGER aumentar_meta_vendedor AFTER INSERT ON public.produtos_vendas FOR EACH ROW EXECUTE FUNCTION public.aumentar_meta_vendedor();
 ?   DROP TRIGGER aumentar_meta_vendedor ON public.produtos_vendas;
       public          postgres    false    224    236            �           2620    17802    vendedores criar_usuario    TRIGGER     u   CREATE TRIGGER criar_usuario AFTER INSERT ON public.vendedores FOR EACH ROW EXECUTE FUNCTION public.criar_usuario();
 1   DROP TRIGGER criar_usuario ON public.vendedores;
       public          postgres    false    239    217            �           2620    17798    vendas diminuir_meta_vendedor    TRIGGER     �   CREATE TRIGGER diminuir_meta_vendedor BEFORE DELETE ON public.vendas FOR EACH ROW EXECUTE FUNCTION public.diminuir_meta_vendedor();
 6   DROP TRIGGER diminuir_meta_vendedor ON public.vendas;
       public          postgres    false    237    222            �           2620    17800    vendedores excluir_usuario    TRIGGER     �   CREATE TRIGGER excluir_usuario AFTER UPDATE ON public.vendedores FOR EACH ROW WHEN ((new.ativo = false)) EXECUTE FUNCTION public.excluir_usuario();
 3   DROP TRIGGER excluir_usuario ON public.vendedores;
       public          postgres    false    217    238    217            �           2606    17789 /   produtos_vendas produtos_vendas_id_produto_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.produtos_vendas
    ADD CONSTRAINT produtos_vendas_id_produto_fkey FOREIGN KEY (id_produto) REFERENCES public.produtos(id);
 Y   ALTER TABLE ONLY public.produtos_vendas DROP CONSTRAINT produtos_vendas_id_produto_fkey;
       public          postgres    false    224    3212    215            �           2606    17784 -   produtos_vendas produtos_vendas_id_venda_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.produtos_vendas
    ADD CONSTRAINT produtos_vendas_id_venda_fkey FOREIGN KEY (id_venda) REFERENCES public.vendas(id);
 W   ALTER TABLE ONLY public.produtos_vendas DROP CONSTRAINT produtos_vendas_id_venda_fkey;
       public          postgres    false    222    224    3228            �           2606    17771    vendas vendas_id_cliente_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.vendas
    ADD CONSTRAINT vendas_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.clientes(id);
 G   ALTER TABLE ONLY public.vendas DROP CONSTRAINT vendas_id_cliente_fkey;
       public          postgres    false    222    3224    220            �           2606    17766    vendas vendas_id_vendedor_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.vendas
    ADD CONSTRAINT vendas_id_vendedor_fkey FOREIGN KEY (id_vendedor) REFERENCES public.vendedores(id);
 H   ALTER TABLE ONLY public.vendas DROP CONSTRAINT vendas_id_vendedor_fkey;
       public          postgres    false    3216    217    222            ;   ?  x�mR�j�0<��B`D�G�ܚ&}������+�"[FrB��;�c]K�@�9�,���h��V!?(}A��Z�����؏Z���a�e����������ag��7?�0�I�|��WM���"_�]�ɋ���iu��"���\I��"�z�q�����~0�/�q������^��
6h5m�{�:���������]�2DFӿ���M��$�<«2N1��xB��Ƹ	�zB�I�E�W?f�dP؝%7i������H\���fX�E3����;O�h�PGx���e��U��t��W��	4�d��]0�~:q¤      6   m  x�m��n�0�מ��0�?`{�L�U�VM�U78đ��6��N�E�J]�}^�<�I4����߹��to�I_ۘ�n5�51M�c�Q�U
��rn֮���ˣ�l�;�����Zpɫ��b�0�nC����`#�����=��'����J��1Gn�p����8<�a��g�JHY\��"UM3���w:,�?�4�hL��3�_���4�D�G;tfH��6��( S�2"+���柽�lg�v�ʙ濃m I3���ڬʉ;���4?���,iIyA��L��eb���>��/��Cc� "��G�96�o�t�O=�S��(����+*�KA?�Z�K��ڂ����̡���8�y�"�0��$ۿC��е9B2Q�L��!��~0�bh����P�Z��k���qwA���1�C��'��H�9��i)��
ȸ"�oǡ�H���%��ou�ks/���&p�׆�w���jNĥ��@��oy)�9��B�B�DPZ�uN@���J`�Ӵ�S�L�>ݿ́��~��,���w֯��g����,��܉⥔Y�]�5�NH��@��ܯ~�ٴ>*�8`��7:���Y�q�ЊrNTAc%�١t߶���?����      ?   �   x�%���0�R1�>�K��c�Ȅ8�*���c��Dt�$?���".�;���o�lVC�*8�,![r�r	 ��eo��ކ��E��Z�Va
�nS�ʓ�!��r��y�;lYyu�~�#u��%Őy[�w+����?L�#�      9   �   x�m�;1D��0�����lq6�����!-r�7�4~RjWz��*�����F,�����8<��J�s��J��Es�y�Mw�v4�S^�;��[Kd0E^B+o� h�݁#cQ5��B�e��Ϸ �W�A���ap�      =   �   x�eйC!��p�aup�Z��Q�C���EA<颭���^_��#߻J��H'���b��#��b�����08������)&��zY)��p��s��iBc����:�	�KF
�~N�I8��Sk���Z�      8   �  x��ӽN�0���~�`%Nl����J,,�Z�%�QR
�=>W����K~����J��<8���.D:b<7_ڽw��x���75�J���� P�e	�QT1؃u�ո�J�m��j���+.J�X3�am�y���{p!�Ϙ3����eAd��%d���VKg�o���5���|�T�[�c�4��B�\���f��9êT[$��?��fI�w�����oOQ3�N�낄�L&�*N�����z��n�[|��f"Kū���IbUN[����j������cG]�2�I����<�)X'k�3u�3K���m����6[8��A��~y���Mwǜam���
R�����UYx��t���'�5��?�<G8NT�V��l6�2%#h     