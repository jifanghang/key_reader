import time
#import pygame
import os
import sys

#def main(bpm = 120, bpb = 4):
def start_metronome(bpm, bpb):

    #pygame.init()
    #pygame.mixer.init()
    #track1 = pygame.mixer.Sound("boink.ogg")

    sleep = 60.0 / bpm
    counter = 0
    while True:
        counter += 1
        if counter % bpb:
            print ('tick')
            #track1.play()
        else:
            print ('TICK')
        sys.stdout.write('\a')
        sys.stdout.flush()
        time.sleep(sleep)



#main()
