"""
Ghost.py-base end2end test suite for TODOMVC.

:author: 2012, Pascal Hartig <phartig@weluse.de>
:license: Public Domain
"""


import unittest
from ghost import Ghost


# TODO: Derive from GhostTestCase and use a static serving WSGI app.
URL = "http://localhost:8000/"


class AppTestCase(unittest.TestCase):

    def setUp(self):
        self.ghost = Ghost()

    def test_smoke_load(self):
        """Page loads without an error"""

        self.ghost.open(URL)
        self.ghost.wait_for_page_loaded()
        self.ghost.set_field_value("#new-todo", "New TODO")


if __name__ == "__main__":
    unittest.main()
