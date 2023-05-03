import pg from "pg";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const devCon = {
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.DB_PORT,
};

const pool = new pg.Pool( devCon );

const tips = [
  [
    `Topic: chage - user account aging

To get to aging info of user test1:

  # chage -l test1

Set the MAXIMUM period between password change to 500 days:

  $	sudo chage -M 500 test1`
  ],
  [
    `Command: date

--- With date command it is easy to format a string with date and time information.
$ date "+%Y:%m:%d-%H%M%S-DATEDIR"

--- This can be used as part of a variable as well:
$ export MYVAR="HALOO-"date "+%F-%T-DATEDIR"
$ echo $MYVAR

(Author: Petteri)`
  ],
  [
    `Topic: find

Find files from current location (.) with precise name. For each hit, run a command - this time grep from the found file ({}) - end the command with semicolon ... escape it to make part of parameter

$ find . -name "wisdom.txt" -exec grep -i vote {} \;`
  ],
  [
    `Topic: for loop (bash)

Example one liner:

$ for file in ls; do echo $file; done`
  ],
  [
    `Topic: gpasswd

With gpasswd command a user can be promoted to a group admin.
Set user u1 as admin to group engineers:

$ gpasswd -A u1 engineers

Demote user u2 from engineers group admins:

$ gpasswd -d u2 engineers

See the admins of the group:

$ grep engineers /etc/gshadow`
  ],
  [
    `Topic: LVM - Logical Volume Management

LVM is a technique for creating dynamically expandable storage volumes. A mounted volume can be expanded on the fly with no need for restarting services using it.

Logically steps for creating a LVM device are:
- Create a (logical) volume group and add physical devices to it.
- Create a logical partition using the volume group
- Make a file system (like ext4) to the partition and mount it
- Afterwards the logical partition can be expanded to the limit of free space in volume group and volume group by adding physical devices

Steps to create a brand new LVM device:

# lsblk  (diagnose)
# pvcreate /dev/xvdc /dev/xvde         (not needed necessarily)
# vgcreate vg200 /dev/xvdc /dev/xvde   (Create the pool)
# lvcreate -n vision200 -L 2G vg200    (Create a mountable partition)
# mkfs.xfs /dev/vg200/vision200        (Make filesystem)
# mount /dev/vg200/vision200 /vision200`
  ],
  [
    `Topic: LVM - Logical Volume Management

To expand the existing LVM partition:

# lvextend -L +1G /dev/vg200/vision200
# xfs_growfs /vision
... OR:
# lvresize -l +100%FREE /dev/vg200/vision`
  ],
  [
    `Command: useradd

Example: Create a user with userid "userjohn" with bash shel (-s). Create home directory (-m) automatically and provide natural name (-c). Uidnumber will be automatically generated.

  $ useradd -m -c "User John" -s /bin/bash userjohn`
  ],
  [
    `Topic: wc

wc - counts the number of characters and lines.
Example: calculate nr of lines:

$ wc -l file.txt`
  ],
  [
    `Command: wget

--- To fetch a file from Internet with HTTP use this command.

Example:

$ wget https://www.rfc-editor.org/rfc/rfc19.txt

Direct output to specific file:

$ wget -O somefile.txt https://www.rfc-editor.org/rfc/rfc19.txt


Other alternatives for command line HTTP:
* curl


(Author: Petteri)`
  ],
  [
    `According to Larry Wall, the original author of the Perl programming language, there are three great virtues of a programmer; Laziness, Impatience and Hubris

* Laziness: The quality that makes you go to great effort to reduce overall energy expenditure. It makes you write labor-saving programs that other people will find useful and document what you wrote so you don't have to answer so many questions about it.
* Impatience: The anger you feel when the computer is being lazy. This makes you write programs that don't just react to your needs, but actually anticipate them. Or at least pretend to.
* Hubris: The quality that makes you write (and maintain) programs that other people won't want to say bad things about.`
  ],
  [
    `I well remember when this realization first came on me with full force.
The EDSAC was on the top floor of the building and the tape-punching and
editing equipment one floor below. ...
It was on one of my journeys between the EDSAC room and the punching equipment
that "hesitating at the angles of stairs" the realization came over me with
full force that a good part of the remainder of my life was going to be spent
in finding errors in my own programs.

Maurice Wilkes. Memoirs of a computer pioneer. `
  ],
];

pool.query(
  `INSERT INTO tips (description) VALUES ($1), ($2), ($3), ($4), ($5), ($6),
  ($7), ($8), ($9), ($10), ($11), ($12) ON CONFLICT (id) DO NOTHING`,
  [...tips.flat()],
  (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Rows inserted:", res.rowCount);
  }
);
