#include <iostream>
#include <cmath>
#include <vector>
#define M_PI 3.14159265358979323846

using namespace std;

double get_fx(double E, double e, double M) {
return E - e * sin(E) - M;
}

double get_dfx(double E, double e) {
return 1 - e * cos(E);
}

double get_M(double a, double t, double mu) {
return sqrt(mu / (a * a * a)) * t;
}

int main() {

double delta_V = 0.5; //
double H_kr = 180; // высота круговой орбиты
double mu = 398603; // гравитационный параметр
double R = 6371; // радиус Земли
double t0 = 0;

double V_kr = sqrt(mu / (R + H_kr)); // скорость круговой орбиты
double V0 = V_kr + delta_V; // начальная скорость
double h = V0 * V0 - (2 * mu / (R + H_kr));
double a = (mu / h) * (-1); // большая полуось
double e = sqrt(1 + (V0 * V0 * pow((R + H_kr), 2) * h) / (mu * mu)); // эксцентриситет
double p = a * (1 - e * e); // фокальный параметр
double T = 2 * M_PI * pow(a, 1.5) / sqrt(mu); // период обращения

double eps = 0.0001; // точность решения

vector<double> t, V, Vn, Vr, Theta, E, r, H;
double x0 = 0, x1 = 0, M = 0, fx = 0, dfx = 0, delt_x1 = 0;
double step = T / 30, tx0 = 0;
int i = 0;

while (fx * dfx <= 0) {
M = get_M(a, tx0, mu);
x0 = M;
fx = get_fx(x0, e, M);
dfx = get_dfx(x0, e);
tx0 += step;
}
std::cout << "Начальное приближение = " << x0 << std::endl;
std::cout << "Начальное время = " << t0 << std::endl;
t0 = 0;
t.push_back(tx0);

while (t[i] < T) {
M = get_M(a, t[i], mu);
x0 = M;
fx = get_fx(x0, e, M);
dfx = get_dfx(x0, e);
delt_x1 = fx / dfx * (-1);
x1 = x0 + delt_x1;

while (abs(delt_x1) > eps) {
x0 = x1;
fx = get_fx(x0, e, M);
dfx = get_dfx(x0, e);
delt_x1 = fx / dfx * (-1);
x1 = x0 + delt_x1;
}
E.push_back(x1);
Theta.push_back(2 * atan(sqrt((1 - e) / (1 + e)) * tan(E[i] / 2)));
r.push_back(p / (1 + e * cos(Theta[i])));
Vn.push_back(sqrt(mu / p) * (1 + e * cos(Theta[i])));
Vr.push_back(sqrt(mu / p) * e * sin(Theta[i]));
V.push_back(sqrt(Vn[i] * Vn[i] + Vr[i] * Vr[i]));
H.push_back(V[i] * V[i] - (2 * mu / (R + H_kr)));
i++;
t.push_back(t[i - 1] + step);
std::cout << "Функция для метода Ньютона = " << fx << std::endl;
std::cout << "Производная функции для метода Ньютона = " << dfx << std::endl;
std::cout << "Первое приближение = " << x1 << " ";
std::cout << "Приращение приближения = " << abs(delt_x1) << std::endl;
}
std::cout << "Начальная скорость = " << V0 << std::endl;
std::cout << "Постоянная интеграла энергии = " << h << std::endl;
std::cout << "Фокальный параметр = " << p << std::endl;
std::cout << "Эксцентриситет = " << e << std::endl;
std::cout << "Большая полуось = " << a << std::endl;
std::cout << "Значения угла эксцентрической аномалии = ";
for (int j = 0; j < i; j++)
{
cout << E[j] << " ";
}
cout << endl;
std::cout << "значения времени = ";
for (int j = 0; j < i; j++)
{
cout << t[j] << " ";
}
cout << endl;
std::cout << "Значения угла истинной аномалии = ";
for (int j = 0; j < i; j++)
{
cout << Theta[j] << " ";
}
cout << endl;
std::cout << "Значения радиус-вектора = ";
for (int j = 0; j < i; j++)
{
cout << r[j] << " ";
}
cout << endl;
std::cout << "Значения трансверсальной скорости = ";
for (int j = 0; j < i; j++)
{
cout << Vn[j] << " ";
}
cout << endl;
std::cout << "Значения радиальной скорости = ";
for (int j = 0; j < i; j++)
{
cout << Vr[j] << " ";
}
cout << endl;
std::cout << "Значения модуля скорости = ";
for (int j = 0; j < i; j++)
{
cout << V[j] << " ";
}
std::cout << endl;
}