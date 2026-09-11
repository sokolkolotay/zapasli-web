# Production deployment

The public endpoint is `https://zapasli.sokolkolotaj.ru`.

The site runs as a hardened static Caddy container on the existing
`zapasli_edge` Docker network. It has a read-only filesystem, no host ports,
and only the network-bind capability. The public Caddy instance from
`zapasli-backend` terminates TLS and proxies requests to `zapasli-web:8080`.

## Requirements

- the checked-out repository is located at `/opt/zapasli/web`;
- the `zapasli_edge` network exists;
- the public Caddy configuration contains the site hostname;
- only the public Caddy container publishes host ports `80` and `443`.

## Start

```sh
docker compose config --quiet
docker compose up -d
docker compose ps
```

Do not add credentials, analytics identifiers, private contact details, or
production configuration to this repository.
