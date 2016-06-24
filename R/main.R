#   Build and Reload Package:  'Cmd + Shift + B'
#   Check Package:             'Cmd + Shift + E'
#   Test Package:              'Cmd + Shift + T'
# opencpu$browse("/library/ToS/www/")

res <- read.xlsx("./inst/www/data/en.xlsx",1)
drop <- c("Timestamp", "age", "job", "sversion", "stop_reason",
          "start_reason", "eversion", "other_game", "which_game",
          "money", "comback", "comback_reason", "which_game.1")

ts_data <- res[!names(res) %in% drop]
ts_data <- na.exclude(ts_data)
piad <- as.factor(sapply(ts_data$piad, function(x) if(x==1) return(TRUE) else return(FALSE)))
ts_data$gender <- as.factor(ts_data$gender)
ts_data$piad <- piad

n <- as.integer(0.15 * nrow(ts_data))
index <- sample(1:nrow(ts_data), n)

train_data <- ts_data[-index,]
test_data <- ts_data[index, colnames(ts_data) != "piad"]
test_type <- ts_data[index, "piad"]

fit <- cforest(piad~., data = train_data,  controls=cforest_unbiased(ntree=2000, mtry=5))

accuracy <- function(truth, prediction) {
  tbl <- table(truth, prediction)
  sum(diag(tbl))/sum(tbl)
}

cforestImpPlot <- function(x) {
  cforest_importance <<- v <- varimp(x)
  dotchart(v[order(v)])
}

random_forest <- function() {
  cforestImpPlot(fit)
}

precision <- function() {
  n <- as.integer(0.15 * nrow(ts_data))
  index <- sample(1:nrow(ts_data), n)

  train_data <- ts_data[-index,]
  test_data <- ts_data[index, colnames(ts_data) != "piad"]
  test_type <- ts_data[index, "piad"]

  #fit <- cforest(piad~., data = train_data,  controls=cforest_unbiased(ntree=2000, mtry=5))
  #pred <- stats::predict(fit, test_data, OOB=TRUE, type = "response")
  fit <- randomForest(piad~., data = train_data, importance = TRUE, ntree=1000)
  pred <- predict(fit, test_data, type="class")
  acc <- accuracy(test_type, pred)
  list(message = acc)
}

paid <- function(arg1) {
  record <- fromJSON(arg1)
  record$gender <- factor(record$gender, levels = c("female", "male"))
  fit <- randomForest(piad~., data = train_data, importance = TRUE, ntree=1000)
  pred <- predict(fit, record, type="class")
  #pred <- stats::predict(fit, record, OOB=TRUE, type = "response")
  output <- as.vector(pred)
}
