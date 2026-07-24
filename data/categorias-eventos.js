(function(){
'use strict';
const lista=Object.freeze([
{codigo:'shows_musica',nome:'Shows e Música'},{codigo:'teatro_espetaculos',nome:'Teatro e Espetáculos'},{codigo:'standup_comedia',nome:'Stand-up e Comédia'},{codigo:'exposicoes_artes',nome:'Exposições e Artes'},{codigo:'feiras_mercados',nome:'Feiras e Mercados'},{codigo:'gastronomia',nome:'Gastronomia'},{codigo:'cursos_oficinas',nome:'Cursos e Oficinas'},{codigo:'palestras_networking',nome:'Palestras e Networking'},{codigo:'esportes',nome:'Esportes'},{codigo:'religiao_espiritualidade',nome:'Religião e Espiritualidade'},{codigo:'passeios_experiencias',nome:'Passeios e Experiências'},{codigo:'festas_vida_noturna',nome:'Festas e Vida Noturna'},{codigo:'institucional_cidadania',nome:'Institucional e Cidadania'},{codigo:'outros',nome:'Outros'}
]);
const mapa=Object.freeze(Object.fromEntries(lista.map(c=>[c.codigo,c])));
function nome(codigo){return mapa[codigo]?.nome||'';}
function valida(codigo){return !!mapa[codigo];}
function radios(name,selecionada='',required=false){return lista.map(c=>`<label class="check"><input type="radio" name="${name}" value="${c.codigo}" aria-label="${c.nome}" ${c.codigo===selecionada?'checked':''} ${required?'required':''}> <span aria-hidden="true">${c.nome}</span></label>`).join('');}
function checks(name,selecionadas=[]){const set=new Set(selecionadas);return lista.map(c=>`<label class="check"><input type="checkbox" name="${name}" value="${c.codigo}" ${set.has(c.codigo)?'checked':''} aria-label="${c.nome}"> <span aria-hidden="true">${c.nome}</span></label>`).join('');}
window.AUDESC_CATEGORIAS_EVENTO={lista,mapa,nome,valida,radios,checks};
})();
