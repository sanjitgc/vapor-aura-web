import sys
import mysql.connector

if len(sys.argv) != 3:
    print("Usage: python program.py <username> <password>")
    sys.exit()

username = sys.argv[1]
password = sys.argv[2]

try:
    # Connect to MySQL database
    db = mysql.connector.connect(
        host="localhost",
        user=username,
        password=password,
        database="cse3330"
    )

    print("Successfully connected to the database\n")

    cursor = db.cursor()

    print("Sailors with two or more reservations of red boats and details of all their reservations.\n")

    # Query to find sailors with >= 2 red boat reservations
    query_red = """
        SELECT s.sid, s.sname, COUNT(*) AS count
        FROM Sailors s
        JOIN Reserves r ON s.sid = r.sid
        JOIN Boats b ON r.bid = b.bid
        WHERE LOWER(b.color) = 'red'
        GROUP BY s.sid, s.sname
        HAVING COUNT(*) >= 2;
    """

    cursor.execute(query_red)
    sailors = cursor.fetchall()

    for sid, name, count in sailors:
        print(f"Sailor {sid} whose name is {name} has {count} reservations of red boats.")

        # Query to get all reservations for that sailor
        query_all = """
            SELECT s.sid, s.sname, b.bid, b.bname, b.color
            FROM Sailors s
            JOIN Reserves r ON s.sid = r.sid
            JOIN Boats b ON r.bid = b.bid
            WHERE s.sid = %s;
        """

        cursor.execute(query_all, (sid,))
        reservations = cursor.fetchall()

        print(f"Here are all of {name}'s reservations:")
        for row in reservations:
            print(row)

        print()  

except mysql.connector.Error as err:
    print("Database error:", err)

finally:
    # Close resources
    if 'cursor' in locals():
        cursor.close()
    if 'db' in locals() and db.is_connected():
        db.close()
        print("MySQL connection is closed")