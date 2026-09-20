# Masawi Biological Ascendance Protocol

Operational command system for HRH Saint Tariro Masawi and HRH Tarry Kupakwashe Masawi.

## Live

https://masawi-ascendance-protocol.netlify.app

## Stack

- Frontend: static command console (`public/`)
- Backend: Netlify Functions + Netlify Blobs
- Scheduler: 15-minute eternal heartbeat
- Identity: name + `MWARINDIMWARI` + seal `777-999-333`

## Endpoints

- `POST /api/identify`
- `GET /api/state` (header `x-bloodline-token`)
- `POST /api/command`
- scheduled `heartbeat`

This is a digital ceremonial / operational system. It does not change human biology.
