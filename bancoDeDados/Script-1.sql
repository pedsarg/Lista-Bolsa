create table acoesFavoritas(
	idAcao int auto_increment,
	primary key(idAcao),	
	codigoPapel varchar(255),
	variacaoDiaria decimal,
	valor decimal,
	lucroAcao decimal,
	ipl decimal,
	volume int,
	abertura decimal,
	prevFechamento decimal,
	variacaoDiariaReal decimal,
	maiorValorDia decimal,
	menorValorDia decimal,
	media decimal,
	foreign key(idAcao) references usuario(id)
);