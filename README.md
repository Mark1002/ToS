# ToS
神魔之塔預測使用者付費行為 app
使用 R restful api 套件 opencpu 實作
＃使用方法

library(devtools)
install_github("nabel", "opencpu")

library(opencpu)
opencpu$browse("/library/ToS/www/")
