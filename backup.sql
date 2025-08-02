--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DriverStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DriverStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'ON_LEAVE',
    'SUSPENDED'
);


ALTER TYPE public."DriverStatus" OWNER TO postgres;

--
-- Name: MaintenanceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MaintenanceStatus" AS ENUM (
    'SCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."MaintenanceStatus" OWNER TO postgres;

--
-- Name: MaintenanceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MaintenanceType" AS ENUM (
    'PREVENTIVE',
    'CORRECTIVE',
    'PREDICTIVE'
);


ALTER TYPE public."MaintenanceType" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'USER'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: RouteStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RouteStatus" AS ENUM (
    'PLANNED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."RouteStatus" OWNER TO postgres;

--
-- Name: VehicleStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VehicleStatus" AS ENUM (
    'AVAILABLE',
    'IN_MAINTENANCE',
    'IN_OPERATION',
    'DECOMMISSIONED'
);


ALTER TYPE public."VehicleStatus" OWNER TO postgres;

--
-- Name: VehicleType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VehicleType" AS ENUM (
    'TRUCK',
    'VAN',
    'CAR',
    'MOTORCYCLE',
    'BUS'
);


ALTER TYPE public."VehicleType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Driver; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Driver" (
    id text NOT NULL,
    name text NOT NULL,
    phone text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "licenseExpiry" timestamp(3) without time zone NOT NULL,
    "licenseNumber" text NOT NULL,
    "licenseType" text NOT NULL,
    status public."DriverStatus" DEFAULT 'ACTIVE'::public."DriverStatus" NOT NULL
);


ALTER TABLE public."Driver" OWNER TO postgres;

--
-- Name: Location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Location" (
    id text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "driverId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    accuracy double precision,
    "routeId" text,
    speed double precision,
    "vehicleId" text NOT NULL
);


ALTER TABLE public."Location" OWNER TO postgres;

--
-- Name: Maintenance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Maintenance" (
    id text NOT NULL,
    type public."MaintenanceType" NOT NULL,
    description text NOT NULL,
    cost double precision,
    "vehicleId" text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    status public."MaintenanceStatus" DEFAULT 'SCHEDULED'::public."MaintenanceStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Maintenance" OWNER TO postgres;

--
-- Name: Route; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Route" (
    id text NOT NULL,
    origin text NOT NULL,
    destination text NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone,
    distance double precision,
    "driverId" text NOT NULL,
    "vehicleId" text NOT NULL,
    status public."RouteStatus" DEFAULT 'PLANNED'::public."RouteStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Route" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text,
    "googleId" text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: Vehicle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Vehicle" (
    id text NOT NULL,
    plate text NOT NULL,
    model text NOT NULL,
    year integer NOT NULL,
    type public."VehicleType" NOT NULL,
    status public."VehicleStatus" DEFAULT 'AVAILABLE'::public."VehicleStatus" NOT NULL,
    "driverId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Vehicle" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Driver; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Driver" (id, name, phone, "userId", "createdAt", "updatedAt", "licenseExpiry", "licenseNumber", "licenseType", status) FROM stdin;
\.


--
-- Data for Name: Location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Location" (id, latitude, longitude, "timestamp", "driverId", "createdAt", "updatedAt", accuracy, "routeId", speed, "vehicleId") FROM stdin;
\.


--
-- Data for Name: Maintenance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Maintenance" (id, type, description, cost, "vehicleId", "startDate", "endDate", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Route; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Route" (id, origin, destination, "startTime", "endTime", distance, "driverId", "vehicleId", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, password, "googleId", role, "createdAt", "updatedAt") FROM stdin;
55d78df6-0682-4a45-b7c0-53959000f818	Admin	admin@admin.com	$2b$10$xPqLVIPp69fZM1WeWH/D6uSTLTO.y5mJsUW07/VmOHYExJRmQr8d2	\N	USER	2025-08-02 02:25:46.67	2025-08-02 02:25:46.67
a131436e-802f-48db-a9b7-05cda3556070	Carlos eduardo	carlospinello4030@gmail.com	$2b$10$QOElD39iPvmbWc7z2C.HxubCc3X9K5MtgSS3Y.8WnasqkqBFQ/8Uy	\N	ADMIN	2025-08-02 02:26:27.08	2025-08-02 02:26:27.08
\.


--
-- Data for Name: Vehicle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Vehicle" (id, plate, model, year, type, status, "driverId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9684dc58-ed06-4231-852c-f3e6905e8278	28790a1288a13745bb3f58a506c5f91a58c16c22c7a8c20e68631fcfbf238815	2025-08-02 02:25:19.708143+00	20250725215625_init	\N	\N	2025-08-02 02:25:19.700052+00	1
e4fdd9cb-d8cd-4f4b-8f32-ae20ed7517e4	456f1ed5854e4570cfc1e625ff260044bc2157deb9fb6d9c3f78f1dbeb24c232	2025-08-02 02:25:30.109513+00	20250802022530_init	\N	\N	2025-08-02 02:25:30.098486+00	1
\.


--
-- Name: Driver Driver_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Driver"
    ADD CONSTRAINT "Driver_pkey" PRIMARY KEY (id);


--
-- Name: Location Location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Location"
    ADD CONSTRAINT "Location_pkey" PRIMARY KEY (id);


--
-- Name: Maintenance Maintenance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Maintenance"
    ADD CONSTRAINT "Maintenance_pkey" PRIMARY KEY (id);


--
-- Name: Route Route_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Route"
    ADD CONSTRAINT "Route_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Vehicle Vehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vehicle"
    ADD CONSTRAINT "Vehicle_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Driver_licenseNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Driver_licenseNumber_key" ON public."Driver" USING btree ("licenseNumber");


--
-- Name: Driver_phone_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Driver_phone_key" ON public."Driver" USING btree (phone);


--
-- Name: Location_driverId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Location_driverId_idx" ON public."Location" USING btree ("driverId");


--
-- Name: Location_timestamp_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Location_timestamp_idx" ON public."Location" USING btree ("timestamp");


--
-- Name: Location_vehicleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Location_vehicleId_idx" ON public."Location" USING btree ("vehicleId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_googleId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_googleId_key" ON public."User" USING btree ("googleId");


--
-- Name: Vehicle_plate_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Vehicle_plate_key" ON public."Vehicle" USING btree (plate);


--
-- Name: Driver Driver_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Driver"
    ADD CONSTRAINT "Driver_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Location Location_driverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Location"
    ADD CONSTRAINT "Location_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES public."Driver"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Location Location_routeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Location"
    ADD CONSTRAINT "Location_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES public."Route"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Location Location_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Location"
    ADD CONSTRAINT "Location_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."Vehicle"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Maintenance Maintenance_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Maintenance"
    ADD CONSTRAINT "Maintenance_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."Vehicle"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Route Route_driverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Route"
    ADD CONSTRAINT "Route_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES public."Driver"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Route Route_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Route"
    ADD CONSTRAINT "Route_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."Vehicle"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Vehicle Vehicle_driverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vehicle"
    ADD CONSTRAINT "Vehicle_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES public."Driver"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

