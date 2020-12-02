from django.core.validators import RegexValidator
import re

comma_separated_float_list_re = re.compile('^([-+]?\d*\.?\d+[,\s]*)+$')
validate_comma_separated_float_list = RegexValidator(comma_separated_float_list_re, (u'Enter only floats separated by commas.'), 'invalid')
