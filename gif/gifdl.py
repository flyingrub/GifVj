#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

"""gif dl

Usage:
    gifdl
    gifdl <index>
    gifdl -h | --help


Options:
    -h --help          Show this screen
"""

import logging
import os
import signal
import sys
import time
import warnings
import math
import shutil
import requests
import re
import tempfile
import bs4 as BeautifulSoup
import subprocess
from docopt import docopt

logging.basicConfig(level=logging.DEBUG, format='%(message)s')
logging.getLogger('requests').setLevel(logging.WARNING)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.newline = print

arguments = None
index = None
default_url = ('http://archillect.com/{0}')
invalid_chars = '\/:*?|<>"'


def main():
    """
    Main function, call parse_url
    """
    global index
    arguments = docopt(__doc__, version='v0.0.1')

    index = int(arguments['<index>']) if arguments['<index>'] else 1
    if index == 1:
        if os.path.isfile("lastindex") :
            with open("lastindex", 'r') as lastindex:
                index = int(lastindex.read())

    signal.signal(signal.SIGINT, signal_handler)
    logger.debug('Downloading to '+os.getcwd()+'...')

    while index > 0:
        index -= 1
        archillect_request = requests.get(default_url.format(index))
        if archillect_request.history:
            continue
        soup = BeautifulSoup.BeautifulSoup(archillect_request.text, 'lxml')
        gif = soup.find(id="ii")['src']

        if gif.endswith('.gif'):
            image_request = requests.get(gif, stream=True)
            filename = "{0}.gif".format(index)
            logger.debug(index)

            img = image_request.content
            with open(filename, 'wb') as out_file:
                out_file.write(img)

        
    end()


def end():
    with open("lastindex", 'w') as out_file:
        out_file.write("{0}\n".format(index))


def signal_handler(signal, frame):
    """
    Handle Keyboardinterrupt
    """
    logger.newline()
    logger.info('Good bye!')
    end()
    sys.exit(0)

if __name__ == '__main__':
    main()
