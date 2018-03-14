# from math import log as mylog
import mido
import time
import csv
import signal
import threading
import sys
import metronome

# def myopening (myfilename):
#     with open(myfilename, 'r') as f:
#         for i in f:
#             print (i)
#
# def summe (x,y):
#     return x+y
#
# def loggy (x):
#     return mylog(x, 2)
#
# def megasum (x,f):
#     return x - f(x,x)
#
# class KlasName (object):
#     def __init__ (self):
#         self.firstName = ""
#         self.lastName = ""
#
#     def rename (self, first="Michael", second="Sedlmair"):
#         self.firstName = first
#         self.lastName = second
#
# def myforloop ():
#     j = 0
#     for i in range(1,11):
#         j += i
#     return j


def helloMIDI ():

    # metronome.start_metronome(120,4)

    msg = mido.Message('note_on', note=60)
    print (msg)
    #mido.get_input_names()
    #['Fishman TriplePlay TP Control', 'Fishman TriplePlay TP Guitar']
    inport = mido.open_input(mido.get_input_names()[1])
    #['GR-55']
    #inport = mido.open_input(mido.get_input_names()[0])
    ourtime = time.time()


    if len(sys.argv) != 2:
        print ("Please put a name")
        sys.exit(666)

    myFile = open(sys.argv[1] + ".csv", "w")
    csvFile = csv.writer(myFile)


    # stop = False
    # class mythread (threading.Thread):
    #     def run(self):
    #         self.stop=False
    #         print ("started")
    #         while not self.stop:
    #             key = input()
    #             print (key)
    #             if key=="save":
    #                 print ("here")
    #                 self.stop = True

    # t = mythread()
    # t.start()

    row = ["type","time","channel","note","velocity","pitch"]
    csvFile.writerow(row)

    for msg in inport:

        #HOW TO PARSE A Message so I can access note???
        #msg = msg.note
        # print (t.stop)
        # if t.stop:
        #     break

        if(msg.type!="control_change"):
            msg.time = time.time() - ourtime
            row = [msg.type, msg.time, msg.channel]
            if hasattr(msg, "note"):
                row = [msg.type, msg.time, msg.channel, msg.note, msg.velocity, None]
                print (msg)
            elif hasattr(msg, "pitch"):
                row = [msg.type, msg.time, msg.channel, None, None, msg.pitch]
            csvFile.writerow(row)
            print (msg)



    print ("Goodbye, closing now!")
    myFile.close()
    # t.join()


    #outport = mido.open_output()
    #outport.send(msg)
    #return msg


if __name__ == "__main__":

    helloMIDI ()

    #myopening ('myfile.txt')
    #x = range(2,10,2)
    #y = [(i+1)*2 for i in x]
    #k = KlasName()
    #k.rename()
    #print (helloMIDI())
    #print ("yay, this is so awesome, or not ==   " + str(helloMIDI()) + " wait for it:  ")
    #print (__file__)
else:
    print ("nothing")
    #print (__name__)
