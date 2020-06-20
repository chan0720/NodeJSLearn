import unittest
from QUENT.agent.ebest import ebest
import inspect
import time

class TestEBest(unittest.TestCase):
    def setUp(self):
        self.ebest = EBest("DEMO")
        self.ebest.login()
    def tearDown(self):
        self.ebest.logout()
