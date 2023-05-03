#!/bin/bash

# Check if we have interactive shell. If not, don't run this command.
tty -s || exit

 if [ ! "$TIPS_REPO" ]; then
  # Default value for tips directory
  TIPS_REPO=~/tips
fi

CURTIP=`cat ~/.curtip`

# If no value in the current index file, start from start
if [ -z $CURTIP ] ; then
	  CURTIP=1
fi

# Character 'j' for looping - user input 
CONTINUE='j'
while [ "$CONTINUE" = 'j' ] ; do

TIPFILE=$TIPS_REPO/$CURTIP.txt

clear
echo
echo "================================================"
echo " TIP OF TODAY ($TIPFILE) "
echo "------------------------------------------------"
cat $TIPFILE
echo "================================================"
echo

NUMTIPS=`ls $TIPS_REPO/*.txt | wc -l`

NEXT=`expr $CURTIP % $NUMTIPS`
NEXT=`expr $NEXT + 1`
CURTIP=$NEXT
echo $NEXT > ~/.curtip

read -p "Press 'j' for next tip - any other to quit ... " -n1 ANS
CONTINUE="$ANS"

done

echo
