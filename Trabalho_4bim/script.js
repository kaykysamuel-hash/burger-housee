// DADOS DOS PRODUTOS
const cardapio = [
    { id: 1, nome: "X-Bacon", preco: 25.00, img: "🥓", desc: "Burger bovino 160g, muito bacon crocante, queijo cheddar e maionese da casa no pão brioche." },
    { id: 2, nome: "X-Salada", preco: 22.50, img: "🥗", desc: "Burger bovino 160g, alface americana, tomate fresco, queijo prato e molho especial." },
    { id: 3, nome: "Batata Frita", preco: 15.00, img: "🍟", desc: "Porção generosa de batatas rústicas, fritas na hora, sequinhas e crocantes." },
    { id: 4, nome: "Refrigerante", preco: 8.00, img: "🥤", desc: "Lata 350ml. Temos Coca-Cola, Guaraná e Fanta (Normal e Zero)." },
    { id: 5, nome: "Combo Família", preco: 85.00, img: "👨‍👩‍👧‍👦", desc: "4 X-Saladas + 2 Porções de Batata + 1 Refrigerante 2L." },
    { id: 6, nome: "Sorvete", preco: 12.00, img: "🍦", desc: "Casquinha crocante com sorvete de baunilha e calda de chocolate quente." },
    { id: 7, nome: "Hot Dog", preco: 18.00, img: "🌭", desc: "Salsicha artesanal, purê de batata, vinagrete, milho e batata palha." } 
];

let carrinho = [];
let cupomAplicado = false;
const DESCONTO_PERCENTUAL = 0.10; // 10%

// RENDERIZAR PRODUTOS
function carregarProdutos() {
    const grid = document.getElementById('grid-produtos');
    grid.innerHTML = '';
    let i = 0; 
    while (i < cardapio.length) {
        const produto = cardapio[i]; 
        const div = document.createElement('div');
        div.className = 'produto';
        div.innerHTML = `
            <div class="img-placeholder">
                <span style="font-size: 3rem;">${produto.img}</span>
                <div class="descricao-hover"><p>${produto.desc}</p></div>
            </div>
            <div class="info-produto">
                <div class="nome-produto">${produto.nome}</div>
                <div class="preco-produto">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
                <button class="btn-adicionar" onclick="adicionarAoCarrinho(${produto.id})">ADICIONAR</button>
            </div>
        `;
        grid.appendChild(div);
        i++; 
    }
}

// FUNÇÕES DO CARRINHO
function adicionarAoCarrinho(id) {
    const itemExistente = carrinho.find(item => item.id === id);
    const produtoInfo = cardapio.find(p => p.id === id);
    if (itemExistente) { itemExistente.qtd += 1; } 
    else { if(produtoInfo) { carrinho.push({ ...produtoInfo, qtd: 1 }); } }
    atualizarCarrinho();
}

function diminuirQuantidade(id) {
    const item = carrinho.find(p => p.id === id);
    if (item) {
        item.qtd--; 
        if (item.qtd <= 0) { carrinho = carrinho.filter(p => p.id !== id); }
    }
    atualizarCarrinho();
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarCarrinho();
}

// LÓGICA DO CUPOM
function aplicarCupom() {
    const input = document.getElementById('input-cupom');
    const msg = document.getElementById('msg-cupom');
    const codigo = input.value.trim().toUpperCase();

    if (carrinho.length === 0) {
        msg.className = 'msg-feedback msg-erro';
        msg.innerText = "Adicione itens ao carrinho antes de aplicar cupom.";
        return;
    }

    if (codigo === "BURGER10") {
        if (!cupomAplicado) {
            cupomAplicado = true;
            msg.className = 'msg-feedback msg-sucesso';
            msg.innerText = "Cupom de 10% aplicado com sucesso!";
            input.disabled = true;
            atualizarCarrinho(); 
        } else {
            msg.className = 'msg-feedback msg-erro';
            msg.innerText = "Cupom já aplicado.";
        }
    } else {
        msg.className = 'msg-feedback msg-erro';
        msg.innerText = "Cupom inválido.";
    }
}

// ATUALIZAR INTERFACE
function atualizarCarrinho() {
    const lista = document.getElementById('lista-pedido');
    const subtotalSpan = document.getElementById('valor-subtotal');
    const descontoSpan = document.getElementById('valor-desconto');
    const linhaDesconto = document.getElementById('linha-desconto');
    const totalSpan = document.getElementById('valor-total');
    const contadorFloat = document.getElementById('carrinho-contador');
    const btnFloat = document.getElementById('btn-carrinho-float');
    
    lista.innerHTML = '';
    let subtotal = 0;
    let qtdTotalItens = 0;

    if (carrinho.length === 0) {
        lista.innerHTML = '<li style="color: #ddd; font-style: italic; text-align: center;">Seu carrinho está vazio...</li>';
        btnFloat.classList.add('oculto');
    } else {
        btnFloat.classList.remove('oculto');
    }

    carrinho.forEach(item => {
        const itemTotal = item.preco * item.qtd;
        subtotal += itemTotal;
        qtdTotalItens += item.qtd;

        const li = document.createElement('li');
        li.className = 'item-carrinho';
        li.innerHTML = `
            <div>
                <strong>${item.qtd}x</strong> ${item.nome}
                <br><small>R$ ${itemTotal.toFixed(2).replace('.', ',')}</small>
            </div>
            <div class="acoes-item">
                <button class="btn-add" onclick="adicionarAoCarrinho(${item.id})">+</button>
                <button class="btn-menos" onclick="diminuirQuantidade(${item.id})">-</button>
                <button class="btn-remover" onclick="removerDoCarrinho(${item.id})">X</button>
            </div>
        `;
        lista.appendChild(li);
    });

    let valorDesconto = 0;
    if (cupomAplicado) {
        valorDesconto = subtotal * DESCONTO_PERCENTUAL;
        linhaDesconto.classList.remove('hidden');
    } else {
        linhaDesconto.classList.add('hidden');
    }

    const totalFinal = subtotal - valorDesconto;
    subtotalSpan.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    descontoSpan.innerText = `- R$ ${valorDesconto.toFixed(2).replace('.', ',')}`;
    totalSpan.innerText = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
    contadorFloat.innerText = qtdTotalItens;
}

function limparCarrinho() {
    carrinho = [];
    cupomAplicado = false; 
    document.getElementById('input-cupom').value = '';
    document.getElementById('input-cupom').disabled = false;
    document.getElementById('msg-cupom').innerText = '';
    document.getElementById('msg-cupom').className = 'msg-feedback';
    atualizarCarrinho();
}

// --- MODAL E WHATSAPP ---

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    const modal = document.getElementById('modal-checkout');
    const resumo = document.getElementById('resumo-carrinho');
    const totalModal = document.getElementById('total-modal');

    resumo.innerHTML = '';
    let subtotal = 0;

    carrinho.forEach(item => {
        const itemTotal = item.preco * item.qtd;
        subtotal += itemTotal;
        const div = document.createElement('div');
        div.style.marginBottom = '5px';
        div.style.borderBottom = '1px solid #eee';
        div.innerHTML = `${item.qtd}x ${item.nome} - <strong>R$ ${itemTotal.toFixed(2).replace('.', ',')}</strong>`;
        resumo.appendChild(div);
    });

    let valorDesconto = cupomAplicado ? (subtotal * DESCONTO_PERCENTUAL) : 0;
    let totalFinal = subtotal - valorDesconto;
    totalModal.innerText = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
    modal.classList.remove('hidden');
}

function fecharModal() {
    const modal = document.getElementById('modal-checkout');
    modal.classList.add('hidden');
}

function enviarPedidoWhatsApp(event) {
    event.preventDefault(); 

    const nome = document.getElementById('cliente-nome').value;
    const endereco = document.getElementById('cliente-endereco').value;
    const pagamento = document.getElementById('cliente-pagamento').value;
    const observacao = document.getElementById('cliente-obs').value; // Pega a observação

    let mensagem = `*NOVO PEDIDO - BURGER HOUSE* 🍔\n\n`;
    mensagem += `*Cliente:* ${nome}\n`;
    mensagem += `*Endereço:* ${endereco}\n`;
    mensagem += `*Pagamento:* ${pagamento}\n`;
    
    // Adiciona observação se o cliente escreveu algo
    if(observacao.trim() !== "") {
        mensagem += `*Observações:* ${observacao}\n`;
    }

    mensagem += `\n*ITENS DO PEDIDO:*\n`;

    let subtotal = 0;
    carrinho.forEach(item => {
        const itemTotal = item.preco * item.qtd;
        mensagem += `• ${item.qtd}x ${item.nome} - R$ ${itemTotal.toFixed(2).replace('.', ',')}\n`;
        subtotal += itemTotal;
    });

    let valorDesconto = 0;
    if (cupomAplicado) {
        valorDesconto = subtotal * DESCONTO_PERCENTUAL;
        mensagem += `\nSubtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        mensagem += `\nDesconto (Cupom 10%): - R$ ${valorDesconto.toFixed(2).replace('.', ',')}`;
    }

    const totalFinal = subtotal - valorDesconto;
    mensagem += `\n\n*TOTAL A PAGAR: R$ ${totalFinal.toFixed(2).replace('.', ',')}*`;

    // !!! IMPORTANTE: Mude para o seu número aqui !!!
    const numeroWhatsApp = "5511999999999"; 
    
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
    
    fecharModal();
    limparCarrinho();
}

window.onload = carregarProdutos;