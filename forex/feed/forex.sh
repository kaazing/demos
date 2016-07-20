#!/bin/bash
#
# Copyright (c) 2007-2011, Kaazing Corporation. All rights reserved.
#

s400=false
darwin=false
case "`uname`" in
CYGWIN*) cygwin=true;;
OS400*) os400=true;;
Darwin*) darwin=true;;
esac

CP="./forex-1.0.jar"


for LIBFILE in lib/*.jar
do
  CP="$CP:$LIBFILE"
done

echo $CP

SYSP="-Xmx512m"
java $SYSP -cp $CP -DGATEWAY_HOME=. -DLOG4J_CONFIG=log4j-config.xml com.kaazing.gateway.samples.forex.ForexDemoService $*
