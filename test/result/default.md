// returns the correct output
test/fixture/fork

/* stdout */
test
/**/

/* stderr */
test
/**/

// strips ANSI
test/fixture/ansi

/* stdout */
test-stdout
/**/

/* stderr */
test-stderr
/**/

// is prevented from striping ANSI
test/fixture/ansi

/* stripAnsi */
false
/**/

/* stdout */
%1B%5B31mtest-stdout%1B%5B0m
/**/

/* stderr */
%1B%5B42mtest-stderr%1B%5B0m
/**/