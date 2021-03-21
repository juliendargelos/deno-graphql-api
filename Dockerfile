FROM hayd/alpine-deno:1.4.4
WORKDIR /app
COPY . .
EXPOSE $PORT
RUN deno install -qAf --unstable https://deno.land/x/denon@2.4.7/denon.ts
RUN denon install
CMD denon start
