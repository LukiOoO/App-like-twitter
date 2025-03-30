#!/usr/bin/env bash
# wait-for-it.sh
# Use this script to check if a given host/port is available

WAITFORIT_cmdname=${0##*/}

echoerr() {
  if [[ $WAITFORIT_QUIET -ne 1 ]]; then echo "$@" 1>&2; fi
}

usage() {
  cat << USAGE >&2
Usage:
    $WAITFORIT_cmdname host:port [-s] [-t timeout] [-- command args]
    -h HOST | --host=HOST       Host or IP to test
    -p PORT | --port=PORT       TCP port to test
                                Alternatively, you can provide host:port in a single argument
    -s | --strict               Execute the subcommand only if the test is successful
    -q | --quiet                Do not display status messages
    -t TIMEOUT | --timeout=TIMEOUT
                                Timeout in seconds, 0 means no limit
    -- COMMAND ARGS             Execute the command with arguments after the test is complete
USAGE
  exit 1
}

wait_for() {
  if [[ $WAITFORIT_TIMEOUT -gt 0 ]]; then
    echoerr "$WAITFORIT_cmdname: waiting $WAITFORIT_TIMEOUT seconds for $WAITFORIT_HOST:$WAITFORIT_PORT"
  else
    echoerr "$WAITFORIT_cmdname: waiting for $WAITFORIT_HOST:$WAITFORIT_PORT with no time limit"
  fi
  WAITFORIT_start_ts=$(date +%s)
  while :; do
    if [[ $WAITFORIT_ISBUSY -eq 1 ]]; then
      nc -z $WAITFORIT_HOST $WAITFORIT_PORT
      WAITFORIT_result=$?
    else
      (echo -n > /dev/tcp/$WAITFORIT_HOST/$WAITFORIT_PORT) >/dev/null 2>&1
      WAITFORIT_result=$?
    fi
    if [[ $WAITFORIT_result -eq 0 ]]; then
      WAITFORIT_end_ts=$(date +%s)
      echoerr "$WAITFORIT_cmdname: $WAITFORIT_HOST:$WAITFORIT_PORT is available after $((WAITFORIT_end_ts - WAITFORIT_start_ts)) seconds"
      break
    fi
    sleep 1
  done
  return $WAITFORIT_result
}

wait_for_wrapper() {
  if [[ $WAITFORIT_QUIET -eq 1 ]]; then
    timeout $WAITFORIT_BUSYTIMEFLAG $WAITFORIT_TIMEOUT $0 --quiet --child --host=$WAITFORIT_HOST --port=$WAITFORIT_PORT --timeout=$WAITFORIT_TIMEOUT &
  else
    timeout $WAITFORIT_BUSYTIMEFLAG $WAITFORIT_TIMEOUT $0 --child --host=$WAITFORIT_HOST --port=$WAITFORIT_PORT --timeout=$WAITFORIT_TIMEOUT &
  fi
  WAITFORIT_PID=$!
  trap "kill -INT -$WAITFORIT_PID" INT
  wait $WAITFORIT_PID
  WAITFORIT_RESULT=$?
  if [[ $WAITFORIT_RESULT -ne 0 ]]; then
    echoerr "$WAITFORIT_cmdname: timeout after $WAITFORIT_TIMEOUT seconds waiting for $WAITFORIT_HOST:$WAITFORIT_PORT"
  fi
  return $WAITFORIT_RESULT
}

# Process arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    *:* )
      WAITFORIT_hostport=(${1//:/ })
      WAITFORIT_HOST=${WAITFORIT_hostport[0]}
      WAITFORIT_PORT=${WAITFORIT_hostport[1]}
      shift 1
      ;;
    --child)
      WAITFORIT_CHILD=1
      shift 1
      ;;
    -q | --quiet)
      WAITFORIT_QUIET=1
      shift 1
      ;;
    -s | --strict)
      WAITFORIT_STRICT=1
      shift 1
      ;;
    -h)
      WAITFORIT_HOST="$2"
      if [[ $WAITFORIT_HOST == "" ]]; then break; fi
      shift 2
      ;;
    --host=*)
      WAITFORIT_HOST="${1#*=}"
      shift 1
      ;;
    -p)
      WAITFORIT_PORT="$2"
      if [[ $WAITFORIT_PORT == "" ]]; then break; fi
      shift 2
      ;;
    --port=*)
      WAITFORIT_PORT="${1#*=}"
      shift 1
      ;;
    -t)
      WAITFORIT_TIMEOUT="$2"
      if [[ $WAITFORIT_TIMEOUT == "" ]]; then break; fi
      shift 2
      ;;
    --timeout=*)
      WAITFORIT_TIMEOUT="${1#*=}"
      shift 1
      ;;
    --)
      shift
      WAITFORIT_CLI=("$@")
      break
      ;;
    --help)
      usage
      ;;
    *)
      echoerr "Unknown argument: $1"
      usage
      ;;
  esac
done

if [[ "$WAITFORIT_HOST" == "" || "$WAITFORIT_PORT" == "" ]]; then
  echoerr "Error: you must provide a host and port to test."
  usage
fi

WAITFORIT_TIMEOUT=${WAITFORIT_TIMEOUT:-15}
WAITFORIT_STRICT=${WAITFORIT_STRICT:-0}
WAITFORIT_CHILD=${WAITFORIT_CHILD:-0}
WAITFORIT_QUIET=${WAITFORIT_QUIET:-0}

WAITFORIT_TIMEOUT_PATH=$(type -p timeout)
WAITFORIT_TIMEOUT_PATH=$(realpath $WAITFORIT_TIMEOUT_PATH 2>/dev/null || readlink -f $WAITFORIT_TIMEOUT_PATH)

WAITFORIT_BUSYTIMEFLAG=""
if [[ $WAITFORIT_TIMEOUT_PATH =~ "busybox" ]]; then
  WAITFORIT_ISBUSY=1
  if timeout &>/dev/stdout | grep -q -e '-t '; then
    WAITFORIT_BUSYTIMEFLAG="-t"
  fi
else
  WAITFORIT_ISBUSY=0
fi

if [[ $WAITFORIT_CHILD -gt 0 ]]; then
  wait_for
  WAITFORIT_RESULT=$?
  exit $WAITFORIT_RESULT
else
  if [[ $WAITFORIT_TIMEOUT -gt 0 ]]; then
    wait_for_wrapper
    WAITFORIT_RESULT=$?
  else
    wait_for
    WAITFORIT_RESULT=$?
  fi
fi

if [[ $WAITFORIT_CLI != "" ]]; then
  if [[ $WAITFORIT_RESULT -ne 0 && $WAITFORIT_STRICT -eq 1 ]]; then
    echoerr "$WAITFORIT_cmdname: strict mode - not executing subcommand"
    exit $WAITFORIT_RESULT
  fi
  exec "${WAITFORIT_CLI[@]}"
else
  exit $WAITFORIT_RESULT
fi
