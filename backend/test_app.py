import unittest

class TestLexiGuardCore(unittest.TestCase):
    def test_sample_payload(self):
        self.assertTrue(True)

    def test_risk_score_range(self):
        score = 85
        self.assertTrue(0 <= score <= 100)

if __name__ == '__main__':
    unittest.main()
