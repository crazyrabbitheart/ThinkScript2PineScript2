# Revision date: Jan 04, 2022
declare lower;

input over_bought = 80;
input over_sold = 20;
input KPeriod = 21;
input DPeriod = 3;
input smoothK = 3;
input K2Period = 21;
input D2Period = 3;
input smoothK2 = 1;
input showSignals = {SlowK, SlowD, default Both};
input upperMidLine = 55;
input lowerMidLine = 45;
input showMidLine = yes;

def priceH = high;
def priceL = low;
def priceC = close;
input averageType = AverageType.EXPONENTIAL;

plot K = reference StochasticFull(over_bought, over_sold, KPeriod, DPeriod, priceH, priceL, priceC, smoothK, averageType).FullK;
K.SetLineWeight(3);
K.HideTitle();

#NOTE this isn't use by Raghee so default is off-- can be enabled from the settings if required
K.SetHiding(if smoothK == DPeriod then yes else no);

plot D = MovingAverage(averageType, K, DPeriod);
D.SetLineWeight(3);
D.HideTitle();


def K2 = reference StochasticFull(over_bought, over_sold, K2Period, D2Period, priceH, priceL, priceC, smoothK2, averageType).FullK;
plot D2 = MovingAverage(averageType, K2, D2Period);
D2.SetLineWeight(3);
D2.HideTitle();

#OS/ob and midline markers
plot OverBought = over_bought;
plot OverSold = over_sold;
plot upperMid = upperMidLine;
plot lowermid = lowerMidLine;

OverBought.HideTitle();
OverSold.HideTitle();
OverBought.SetDefaultColor(Color.RED);
OverSold.SetDefaultColor(Color.GREEN);
OverBought.SetPaintingStrategy(PaintingStrategy.DASHES);
OverSold.SetPaintingStrategy(PaintingStrategy.DASHES);
upperMid.SetDefaultColor(Color.GRAY);
upperMid.SetHiding(!showMidLine);
lowermid.SetDefaultColor(Color.GRAY);
lowermid.SetHiding(!showMidLine);
DefineGlobalColor("Midline Background", Color.LIGHT_ORANGE);
AddCloud(if showMidLine then upperMid else Double.NaN,  lowermid, GlobalColor("Midline Background"),  GlobalColor("Midline Background"));

#assign colors
D.SetDefaultColor(Color.CURRENT);
D2.SetDefaultColor(Color.CURRENT);

DefineGlobalColor("Trending Up - D", Color.LIGHT_GREEN);
DefineGlobalColor("Trending Down - D", Color.PINK);
DefineGlobalColor("Trending Up - D2", Color.LIGHT_GREEN);
DefineGlobalColor("Trending Down - D2", Color.PINK);

D.AssignValueColor( if D > D[1] then GlobalColor("Trending Up - D") else GlobalColor("Trending Down - D"));
D2.AssignValueColor( if D2 > D2[1] then GlobalColor("Trending Up - D2") else GlobalColor("Trending Down - D2"));

#signals
def trendUp = K > over_bought;
def trendDown = K < over_sold;

def sellCrossK = K crosses below D and trendUp;
def buyCrossK = K crosses above D and trendDown;

def sellCrossD = D crosses below K and trendUp;
def buyCrossD = D crosses above K and trendDown;

def showK;
def showD;

switch (showSignals)
{
case SlowK:
    showK = 1;
    showD = 0;
case SlowD:
    showD = 1;
    showK = 0;
default:
    showK = 1;
    showD = 1;
}

plot overSoldSignalK = if showK and buyCrossK then D2[1] else Double.NaN ;
overSoldSignalK.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
overSoldSignalK.SetDefaultColor(Color.GREEN);
overSoldSignalK.SetLineWeight(5);
overSoldSignalK.HideTitle();

plot overBoughtSignalK = if showK and sellCrossK then D2[1] else Double.NaN ;
overBoughtSignalK.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
overBoughtSignalK.SetDefaultColor(Color.DARK_RED);
overBoughtSignalK.SetLineWeight(5);
overBoughtSignalK.HideTitle();

plot overSoldSignalD = if showD and buyCrossD then K2[1] else Double.NaN ;
overSoldSignalD.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
overSoldSignalD.SetDefaultColor(Color.WHITE);
overSoldSignalD.SetLineWeight(5);
overSoldSignalD.HideTitle();

plot overBoughtSignalD = if showD and sellCrossD then K2[1] else Double.NaN ;
overBoughtSignalD.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
overBoughtSignalD.SetDefaultColor(Color.YELLOW);
overBoughtSignalD.SetLineWeight(5);
overBoughtSignalD.HideTitle();

